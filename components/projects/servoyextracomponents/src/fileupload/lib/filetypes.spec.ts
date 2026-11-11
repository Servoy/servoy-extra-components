import { describe, it, expect, beforeEach } from 'vitest';
import { FileTypesUtilsService } from './filetypes';

describe('FileTypesUtilsService', () => {
    let service: FileTypesUtilsService;

    beforeEach(() => {
        service = new FileTypesUtilsService();
    });

    describe('find', () => {
        it('finds a type by extension', () => {
            const matches = service.find('pdf');
            expect(matches.length).toBeGreaterThan(0);
            expect(matches[0].desc).toBe('Adobe Portable Document Format');
        });

        it('finds a type by mime type', () => {
            const matches = service.find('application/pdf');
            expect(matches.length).toBeGreaterThan(0);
            expect(matches[0].ext).toContain('pdf');
        });

        it('is case-insensitive', () => {
            const lower = service.find('pdf');
            const upper = service.find('PDF');
            expect(upper.length).toBe(lower.length);
        });

        it('returns an empty array for an unknown extension', () => {
            expect(service.find('notarealext')).toEqual([]);
        });

        it('matches an extension that appears in a multi-extension entry', () => {
            // jpeg entry has ext ['jpeg', 'jpg']
            const matches = service.find('jpg');
            expect(matches.some(m => m.mime.indexOf('image/jpeg') > -1)).toBe(true);
        });
    });

    describe('descriptionFor', () => {
        it('returns the description for a known extension', () => {
            expect(service.descriptionFor('txt')).toBe('Text File');
        });

        it('returns the description for a known mime type', () => {
            expect(service.descriptionFor('text/plain')).toBe('Text File');
        });

        it('falls back to "<EXT> File" for an unknown extension', () => {
            expect(service.descriptionFor('zzz')).toBe('ZZZ File');
        });
    });

    describe('mimeFor', () => {
        it('returns the mime type for a known extension', () => {
            expect(service.mimeFor('pdf')).toBe('application/pdf');
        });

        it('returns null for an unknown extension', () => {
            expect(service.mimeFor('zzz')).toBeNull();
        });
    });

    describe('extensionFor', () => {
        it('returns the extension for a known mime type', () => {
            expect(service.extensionFor('application/pdf')).toBe('pdf');
        });

        it('returns the first extension for a multi-extension mime type', () => {
            expect(service.extensionFor('image/jpeg')).toBe('jpeg');
        });

        it('returns null for an unknown mime type', () => {
            expect(service.extensionFor('application/x-nonexistent')).toBeNull();
        });
    });
});
