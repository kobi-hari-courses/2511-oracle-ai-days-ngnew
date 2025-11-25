import { createMetadataKey, metadata, SchemaPath } from "@angular/forms/signals";

export const LABEL = createMetadataKey<string>();

export function withLabel(p: SchemaPath<any>, label: string) {
    metadata(p, LABEL, () => label);
}