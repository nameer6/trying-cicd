export const getNextPage = ({allPages, LIMIT}: any) => {
  try {
    const currentDataCount = allPages.reduce(
      (sum: number, item: any) => (sum += item?.data?.length),
      0,
    );
    const total = allPages[0]?.total;
    const totalPages = Math.ceil(total / LIMIT);
    const currentPage = Math.ceil(currentDataCount / LIMIT);

    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      return nextPage;
    } else {
      return undefined;
    }
  } catch (err) {
    return undefined;
  }
};

export const selectDataFromResponse = (data: any) => {
  return {
    pages: data.pages.flatMap((x: any) => x?.data),
    pageParams: data.pageParams,
  };
};
