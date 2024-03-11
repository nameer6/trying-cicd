import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ShareSheet from '../create-reveal/share-sheet/ShareSheet';
import ComposeReveal from '../../modules/home/compose-reveal/ComposeReveal';
import SocialMediaShareSheet from '../socialmedial-share-sheet/SocialMediaShareSheet';
import {updateShareDirectlyWith} from 'src/store/reducers/createReveal';
import {useQueryClient} from '@tanstack/react-query';

const ShareRevealComponent = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showModalState, setShowModalState] = useState<{
    show: boolean;
    data?: any;
  }>({
    show: false,
  });
  const {shareDirectlyWith} = useSelector((state: any) => state.createReveal);
  useEffect(() => {
    if (shareDirectlyWith) {
      setShowModalState({
        show: true,
        data: shareDirectlyWith,
      });
    } else {
      // if (showModalState?.show) {
      setShowModalState({show: false});
      // }
    }
  }, [shareDirectlyWith]);

  const [sharesheetModalState, shareSheetModalState] = useState<{
    show: boolean;
    answer_id?: string;
  }>({
    show: false,
    answer_id: '',
  });

  const [shareData, setShareData] = useState<{
    show: boolean;
    data?: any;
  }>({
    show: false,
  });

  const toggleComposeModal = async () => {
    setShowModalState({show: false});
  };

  const handleShare = (answer_id: string) => {
    shareSheetModalState({
      show: true,
      answer_id,
    });
  };

  const shareOnSocial = async (share_data: any) => {
    setShareData({
      show: true,
      data: share_data,
    });
  };

  const closeSocialMediaSheet = () => {
    setShareData({
      show: false,
    });
    closeComposeModal();
  };

  const closeSharesheet = async () => {
    shareSheetModalState({
      show: false,
    });
  };

  const closeComposeModal = () => {
    setShowModalState({show: false});
  };

  const onShareComplete = async () => {
    await dispatch(updateShareDirectlyWith(null));
    queryClient.invalidateQueries(['get-locked-reveals'] as never);
    queryClient.invalidateQueries(['get-reveals'] as never);
    closeComposeModal();
    closeSharesheet();
  };

  return (
    <>
      <ComposeReveal
        show={showModalState?.show}
        onClose={closeComposeModal}
        handleShare={handleShare}
        refreshQuestion={() => {}}
      />
      <ShareSheet
        answer_id={sharesheetModalState.answer_id}
        shareOnSocial={onShareComplete}
        onClose={closeSharesheet}
        show={sharesheetModalState.show}
        shareDirectlyWith={shareDirectlyWith}
        location="other"
      />
      <SocialMediaShareSheet
        show={shareData?.show}
        shareData={shareData?.data}
        onClose={closeSocialMediaSheet}
      />
    </>
  );
};

export default ShareRevealComponent;
