export function formatIndustry(type: string) {
  switch (type) {
    case "building_materials":
      return "建材五金";
    case "auction":
      return "拍卖臻选";
    case "retail":
      return "连锁零售";
    default:
      return type;
  }
}
