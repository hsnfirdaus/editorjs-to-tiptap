import type { AttrTuneConverter } from "./converter.type";

export const alignmentTune: AttrTuneConverter<{ alignment?: string }> = (
  data
) => {
  return {
    textAlign: data.alignment || null,
  };
};
