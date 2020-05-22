import React from "react";
import ReactModal from "react-modal";
import styles from "./styles.module.css";
const modalRoot = document.createElement("div");
modalRoot.setAttribute("id", "modal-root");
document.body.appendChild(modalRoot);

const ModalElement = (WrappedComponent) => {
  ReactModal.setAppElement(document.getElementById("root"));
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
};

export default ModalElement;
