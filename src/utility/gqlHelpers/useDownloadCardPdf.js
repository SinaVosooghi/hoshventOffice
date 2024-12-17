import { gql, useLazyQuery } from "@apollo/client";

// GraphQL query for batch download
const DOWNLOAD_CARDS_PDF = gql`
  query generateBatchCardPdf($users: [UserDataInput!]!) {
    generateBatchCardPdf(data: $users)
  }
`;

const useDownloadCardPdf = () => {
  const [fetchPdf, { loading, error }] = useLazyQuery(DOWNLOAD_CARDS_PDF, {
    onCompleted: (data) => {
      if (data?.generateBatchCardPdf) {
        const link = document.createElement("a");
        link.href = data.generateBatchCardPdf; // URL returned from backend
        link.download = "cards.pdf"; // File name
        link.click();
      }
    },
  });

  const downloadBatchCardPdf = async (users) => {
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("Users array cannot be empty!");
    }

    await fetchPdf({
      variables: {
        users,
      },
    });
  };

  return { downloadBatchCardPdf, loading, error };
};

export default useDownloadCardPdf;
