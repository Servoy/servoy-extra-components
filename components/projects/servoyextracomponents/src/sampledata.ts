import { ServoyApi } from '@servoy/public';

interface SampleDataAwareApi {
    isInSampleDataMode?: () => boolean;
}

export function isInDesignerOrSampleData(api: ServoyApi): boolean {
    return api.isInDesigner() || ((api as unknown as SampleDataAwareApi).isInSampleDataMode?.() ?? false);
}
