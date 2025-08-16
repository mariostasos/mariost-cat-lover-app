export const getGradientColor = (index: number) => {
  const colors = [
    "from-blue-500 to-blue-400",
    "from-amber-500 to-amber-400",
    "from-green-500 to-green-400",
    "from-purple-500 to-purple-400",
    "from-red-500 to-red-400",
    "from-indigo-500 to-indigo-400",
  ];
  return colors[index % colors.length];
};
