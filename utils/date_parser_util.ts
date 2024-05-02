export const date_parser_util = (date: number): string => {
  if (date.toString().length === 10) {
    return new Date(date * 1000).toLocaleString();
  } else if (date.toString().length === 13) {
    return new Date(date).toLocaleString();
  } else {
    return Date.now().toLocaleString();
  }
};
