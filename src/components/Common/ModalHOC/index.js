import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.css";

function ModalElement(WrappedComponent) {
  const Modal = (props) => {
    const { isModalVisible, closeModal, contentLabel, ...rest } = props;
    return (
      <ReactModal
        isOpen={isModalVisible}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick
        className={styles.content}
        overlayClassName={styles.overlay}
        contentLabel={contentLabel}
      >
        <WrappedComponent onDismissAction={closeModal} {...rest} />
      </ReactModal>
    );
  };
  return Modal;
}

export default ModalElement;
