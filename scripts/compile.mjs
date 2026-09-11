export function compile(level, rows) {
  return rows.map((row, index) => {
    const [category, rawIntensity, question, choiceA, choiceB] = row;
    const intensity = tweakIntensity(level, Number(rawIntensity), index);
    const hasChoices = Boolean(choiceA && choiceB);
    const duoTypes = hasChoices
      ? ["match", "same", "predict"]
      : ["same", "predict", "connect", "different"];
    return {
      id: levelId(level) + index + 1,
      level,
      category,
      intensity,
      question,
      duoCompatible: true,
      duoTypes,
      ...(hasChoices ? { choices: [choiceA, choiceB] } : {}),
    };
  });
}

function tweakIntensity(level, intensity, index) {
  if (level === "surface" && intensity === 3 && index % 5 === 0) return 4;
  if (level === "personal" && intensity === 6 && index % 2 === 0) return 7;
  if (level === "deep" && intensity >= 9) return 10;
  if (level === "together" && intensity === 3 && index % 4 === 0) return 4;
  return intensity;
}

function levelId(level) {
  if (level === "personal") return 250;
  if (level === "deep") return 500;
  if (level === "together") return 750;
  return 0;
}
