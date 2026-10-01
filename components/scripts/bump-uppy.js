/*
 * Bump the whole @uppy/* set safely and prove the pins still agree.
 *
 * Why this exists:
 *   Servoy ships servoy-extra-components with EXACT pinned versions. No lockfile
 *   travels into the generated Servoy solution build, so the package.json pins ARE
 *   the lock. If one @uppy package drifts (e.g. a transitive patch raises its
 *   @uppy/core peer), npm can install two copies of @uppy/core and the Angular
 *   build fails with TS2322 (`#private ... refers to a different member`).
 *
 * What it does:
 *   1. Runs npm-check-updates scoped to /@uppy/ against BOTH package.json files
 *      (root + projects/servoyextracomponents), writing the newest versions in.
 *      ncu does NOT verify peer-consistency by itself.
 *   2. Clean-installs (npm 7+ turns peer conflicts into a hard ERESOLVE error).
 *   3. Asserts `npm ls @uppy/core` resolves to EXACTLY ONE version. If more than
 *      one @uppy/core is present, it fails loudly so a future bump can't silently
 *      reintroduce a split.
 *
 * After a green run, build (`npm run build_debug_nowatch`) and review the diff.
 * ncu uses `npx` on demand, so no new devDependency is added to the shipped set.
 *
 * Usage (from components/):
 *   node scripts/bump-uppy.js            # bump to newest, verify
 *   node scripts/bump-uppy.js --verify   # verify current pins only, no bump
 */
var path = require('path');
var child_process = require('child_process');

var COMPONENTS_DIR = path.resolve(__dirname, '..');
var ROOT_PKG = path.join(COMPONENTS_DIR, 'package.json');
var LIB_PKG = path.join(COMPONENTS_DIR, 'projects', 'servoyextracomponents', 'package.json');
var UPPY_FILTER = '/@uppy/';

var verifyOnly = process.argv.indexOf('--verify') !== -1;

// npm/npx are .cmd shims on Windows, so these commands must go through a shell.
// Every argument below is an internal constant (never user input), so building the
// command string here does not expose a command-injection surface.
function run(cmd) {
    console.log('> ' + cmd);
    var result = child_process.spawnSync(cmd, {
        cwd: COMPONENTS_DIR,
        stdio: 'inherit',
        shell: true
    });
    if (result.status !== 0) {
        throw new Error(cmd + ' exited with code ' + result.status);
    }
}

function bump(pkgPath) {
    // --packageFile targets a specific package.json; -u writes the updates in place.
    run('npx npm-check-updates -u --packageFile "' + pkgPath + '" --filter "' + UPPY_FILTER + '"');
}

function assertSingleCore() {
    console.log('> npm ls @uppy/core --all');
    var result = child_process.spawnSync('npm ls @uppy/core --all', {
        cwd: COMPONENTS_DIR,
        encoding: 'utf8',
        shell: true
    });
    var output = (result.stdout || '') + (result.stderr || '');
    console.log(output);

    // Collect every concrete @uppy/core@x.y.z version mentioned in the tree.
    var versions = {};
    var re = /@uppy\/core@(\d+\.\d+\.\d+[^\s]*)/g;
    var match;
    while ((match = re.exec(output)) !== null) {
        versions[match[1]] = true;
    }
    var unique = Object.keys(versions);

    if (unique.length === 0) {
        throw new Error('Could not find any @uppy/core in the dependency tree. Did npm install run?');
    }
    if (unique.length > 1) {
        throw new Error('MULTIPLE @uppy/core versions resolved: ' + unique.join(', ') +
            '. The pinned @uppy/* set is NOT internally consistent — a build split (TS2322) is likely. ' +
            'Align the pins so every @uppy/* package agrees on one @uppy/core.');
    }
    console.log('OK: exactly one @uppy/core resolved (' + unique[0] + ').');
}

function main() {
    if (!verifyOnly) {
        console.log('Bumping @uppy/* in both package.json files...');
        bump(ROOT_PKG);
        bump(LIB_PKG);
        console.log('IMPORTANT: review the diff of both package.json files — the @uppy/* set is duplicated and must stay in sync.');
    } else {
        console.log('Verify-only mode: not changing versions.');
    }

    console.log('Clean install (ERESOLVE here means the pins have a peer conflict)...');
    run('npm install');

    assertSingleCore();

    console.log('\nUppy set is internally consistent. Next: `npm run build_debug_nowatch` and review the package.json diff before committing.');
}

try {
    main();
} catch (err) {
    console.error('\nbump-uppy failed: ' + err.message);
    process.exit(1);
}
