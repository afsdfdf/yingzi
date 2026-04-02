export function formatIndustry(type: string) {
  switch (type) {
    case "building_materials":
      return "建材五金";
    case "auction":
      return "拍卖精选";
    case "retail":
      return "连锁零售";
    default:
      return type;
  }
}

export function formatCurrency(amount: number) {
  return `￥${amount.toFixed(amount % 1 === 0 ? 0 : 1)}`;
}
