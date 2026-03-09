export const orderedNonEmptyCombinations = function* (
  guideIds: string[],
): Generator<string[]> {
  const visit = function* (
    selectedGuideIds: string[],
    remainingGuideIds: string[],
  ): Generator<string[]> {
    if (selectedGuideIds.length > 0) {
      yield selectedGuideIds;
    }

    for (let index = 0; index < remainingGuideIds.length; index += 1) {
      const nextGuideId = remainingGuideIds[index];
      const remainingWithoutCurrent = [
        ...remainingGuideIds.slice(0, index),
        ...remainingGuideIds.slice(index + 1),
      ];
      yield* visit([...selectedGuideIds, nextGuideId], remainingWithoutCurrent);
    }
  };

  yield* visit([], guideIds);
};

export const toGuideRoutePath = (guideIds: string[]): string =>
  `/${guideIds.join(",")}/AGENTS.md`;
