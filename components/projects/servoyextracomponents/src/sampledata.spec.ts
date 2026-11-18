import { describe, it, expect } from 'vitest';
import { ServoyApiTesting } from '@servoy/public';
import { isInDesignerOrSampleData } from './sampledata';

describe('isInDesignerOrSampleData', () => {

    it('is false at runtime and with an api that does not know isInSampleDataMode (older @servoy/public)', () => {
        const api = new ServoyApiTesting();
        expect((api as any).isInSampleDataMode).toBeUndefined();
        expect(isInDesignerOrSampleData(api)).toBe(false);
    });

    it('is true in the designer, also with an api that does not know isInSampleDataMode', () => {
        const api = new ServoyApiTesting();
        api.isInDesigner = () => true;
        expect(isInDesignerOrSampleData(api)).toBe(true);
    });

    it('is true in the sample data render', () => {
        const api: any = new ServoyApiTesting();
        api.isInSampleDataMode = () => true;
        expect(isInDesignerOrSampleData(api)).toBe(true);
    });

    it('is false when the api knows isInSampleDataMode and it is off', () => {
        const api: any = new ServoyApiTesting();
        api.isInSampleDataMode = () => false;
        expect(isInDesignerOrSampleData(api)).toBe(false);
    });
});
