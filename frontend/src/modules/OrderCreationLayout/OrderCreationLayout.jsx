import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from "./OrderCreationLayout.module.css";
import { ReactComponent as LeftArrow } from '../../asset/icon/left_small.svg'
import OrderForm from '../OrderForm/OrderForm'
import { Button, Link } from "../../components";
import { Modal } from '../Modal';

export const OrderCreationLayout = ({ event_id, event_name, children }) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const location = useLocation();

  const isAdminOrderCreate = location.pathname.startsWith('/admin/order/create');
  const backLink = isAdminOrderCreate ? '/admin/order' : `/event/${event_id}`;

  return (
    <div className={styles.orderTableBackground}>
      <div className={styles.tableWrap}>
        <div className={styles.tableTitleWrap}>
          <Link to={backLink}><LeftArrow /></Link>
          <h2 className={styles.tableTitle}>{`[${event_name}] 주문서 생성`}</h2>
        </div>
        <OrderForm event_id={event_id} />
        <div className={styles.actionButtonsWrap}>
          <Button label="임시 저장" className={styles.actionButton} variant='secondary' onClick={() => setIsSaveModalOpen(true)} />
          <Button label="작성 완료" className={styles.actionButton} onClick={() => setIsCreateModalOpen(true)} />
        </div>
      </div>
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="임시저장 알림"
        message="현재까지 작성된 내용이 임시저장되었습니다."
        confirmLabel="확인"
        onConfirm={() => setIsSaveModalOpen(false)}
      />
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="작성완료 알림"
        message="주문서 작성에 성공하였습니다."
        confirmLabel="확인"
        onConfirm={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};