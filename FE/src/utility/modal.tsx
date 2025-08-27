// components/ReusableModal.tsx
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as React from "react";

const style = {
  position: "absolute" as const,
  top: "0",
  left: "0",
  //   transform: "translate(-50%, -50%)",
};

interface ReusableModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="reusable-modal-title"
      aria-describedby="reusable-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  );
};

export default ReusableModal;
