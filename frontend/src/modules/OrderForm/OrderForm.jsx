import React, { useState, useEffect, useCallback } from "react";
import { Button, Input } from "../../components";
import PaymentTable from "./PaymentTable/PaymentTable";
import styles from "./OrderForm.module.css";
import {
  useSaveOrder,
  useSaveTempOrder,
  useOrderDetails,
  useAuthors,
  useAffiliations,
  useEventDetails,
} from "../../api/hooks";

const ORDER_STATUS_MAP = {
  Order_Completed: "주문완료",
  Packaging_Completed: "포장완료",
  Repair_Received: "수선접수",
  Repair_Completed: "수선완료",
  In_delivery: "배송중",
  Delivery_completed: "배송완료",
  Receipt_completed: "수령완료",
  Accommodation: "숙소",
};

export const OrderForm = ({
  event_id,
  isEdit,
  orderId,
  onSave,
  onComplete,
}) => {
  const { data: event, isLoading: isEventLoading } = useEventDetails(event_id);
  const [formData, setFormData] = useState({
    event_id: event_id,
    author_id: "",
    affiliation_id: "",
    orderName: "",
    contact: "",
    address: "",
    collectionMethod: "",
    notes: "",
    totalPrice: 0,
    advancePayment: 0,
    balancePayment: 0,
    isTemporary: false,
    status: "",
    orderItems: [],
    payments: [],
    alteration_details: {
      jacketSleeve: 0,
      jacketLength: 0,
      jacketForm: 0,
      pantsCircumference: 0,
      pantsLength: 0,
      shirtNeck: 0,
      shirtSleeve: 0,
      dressBackForm: 0,
      dressLength: 0,
      notes: "",
    },
  });

  const eventData = event?.data;

  const [customerName, setCustomerName] = useState("");
  const [payerName, setPayerName] = useState("");
  const [isPayerSameAsCustomer, setIsPayerSameAsCustomer] = useState(false);
  const [prepaymentTotal, setPrepaymentTotal] = useState(0);
  const [balanceTotal, setBalanceTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [groupedProducts, setGroupedProducts] = useState({});
  const [payments, setPayments] = useState([
    {
      payment_date: new Date().toISOString(),
      paymentMethod: "advance",
      cashAmount: 0,
      cashCurrency: "KRW",
      cashConvertedAmount: 0,
      cardAmount: 0,
      cardCurrency: "KRW",
      cardConvertedAmount: 0,
      tradeInAmount: 0,
      tradeInCurrency: "GOLD_24K",
      tradeInConvertedAmount: 0,
      notes: "",
    },
    {
      payment_date: new Date().toISOString(),
      paymentMethod: "balance",
      cashAmount: 0,
      cashCurrency: "KRW",
      cashConvertedAmount: 0,
      cardAmount: 0,
      cardCurrency: "KRW",
      cardConvertedAmount: 0,
      tradeInAmount: 0,
      tradeInCurrency: "GOLD_24K",
      tradeInConvertedAmount: 0,
      notes: "",
    },
  ]);

  const saveOrderMutation = useSaveOrder();
  const saveTempOrderMutation = useSaveTempOrder();
  const {
    data: orderDetails,
    isLoading: isLoadingOrderDetails,
    error: orderDetailsError,
  } = useOrderDetails(orderId, { enabled: isEdit });

  const { data: authors, isLoading: isLoadingAuthors } = useAuthors();
  const { data: affiliations, isLoading: isLoadingAffiliations } =
    useAffiliations();

  useEffect(() => {
    if (isEdit && orderDetails) {
      setFormData(orderDetails);
      setCustomerName(orderDetails.orderName);
      setPayerName(orderDetails.payments[0]?.payerName || "");
      setIsPayerSameAsCustomer(
        orderDetails.orderName === orderDetails.payments[0]?.payerName
      );
      setPrepaymentTotal(orderDetails.advancePayment);
      setBalanceTotal(orderDetails.balancePayment);
      setTotalPrice(orderDetails.totalPrice);
    }
  }, [isEdit, orderDetails]);

  useEffect(() => {
    if (eventData && !isEdit) {
      const grouped = eventData.categories.reduce((acc, category) => {
        acc[category.id] = category.products;
        return acc;
      }, {});
      setGroupedProducts(grouped);
      console.log("Grouped Products initialized:", grouped); // 로그: 초기화된 groupedProducts 확인
    }
  }, [eventData, isEdit]);

  useEffect(() => {
    if (isPayerSameAsCustomer) {
      setPayerName(customerName);
    }
  }, [isPayerSameAsCustomer, customerName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleContactChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, contact: value }));
  };

  const handleAffiliationChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, affiliation_id: value }));
  };

  const handleAddressChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, address: value }));
  };

  const handleCollectionMethodChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, collectionMethod: value }));
  };

  const handleNotesChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, notes: value }));
  };

  const handlePaymentChange = useCallback(
    (index) => (updatedPayment) => {
      setPayments((prev) => {
        const newPayments = [...prev];
        newPayments[index] = {
          ...updatedPayment,
          cashConvertedAmount: Number(updatedPayment.cashConvertedAmount) || 0,
          cardConvertedAmount: Number(updatedPayment.cardConvertedAmount) || 0,
          tradeInConvertedAmount:
            Number(updatedPayment.tradeInConvertedAmount) || 0,
        };
        return newPayments;
      });
    },
    []
  );

  const handleAlterationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      alteration_details: {
        ...prev.alteration_details,
        [field]: value,
      },
    }));
  };

  const handleCustomerNameChange = useCallback(
    (e) => {
      setCustomerName(e.target.value);
      setFormData((prev) => ({ ...prev, orderName: e.target.value }));
      if (isPayerSameAsCustomer) {
        setPayerName(e.target.value);
      }
    },
    [isPayerSameAsCustomer]
  );

  const handlePayerCheckboxChange = useCallback(
    (e) => {
      setIsPayerSameAsCustomer(e.target.checked);
      if (e.target.checked) {
        setPayerName(customerName);
      }
    },
    [customerName]
  );

  const handleProductChange = useCallback(
    (categoryId, field, value) => {
      // console.log(
      //   `Change detected - Category: ${categoryId}, Field: ${field}, Value: ${value}, Type of Value: ${typeof value}`
      // ); // 로그: 입력 변경 사항 및 타입 확인

      setSelectedProducts((prev) => {
        const newState = {
          ...prev,
          [categoryId]: {
            ...prev[categoryId],
            [field]: value,
          },
        };

        if (field === "productId") {
          // productId가 문자열로 들어온 경우 숫자로 변환하여 비교
          const productId = parseInt(value, 10);
          const selectedProduct = groupedProducts[categoryId]?.find(
            (p) => p.id === productId
          );

          // console.log("Selected Product after change:", selectedProduct); // 로그: 변경 후 선택된 상품 확인

          if (selectedProduct) {
            newState[categoryId].price = selectedProduct.price;
            newState[categoryId].quantity = 1;
            newState[categoryId].attributes = "";
            newState[categoryId].sizes = selectedProduct.attributes.map(
              (attr) => ({
                id: attr.attribute_id,
                value: attr.value,
              })
            );
          }
        }

        return newState;
      });
    },
    [groupedProducts]
  );

  useEffect(() => {
    const calculateTotal = (payment) => {
      const cash = Number(payment.cashConvertedAmount) || 0;
      const card = Number(payment.cardConvertedAmount) || 0;
      const tradeIn = Number(payment.tradeInConvertedAmount) || 0;
      return cash + card + tradeIn;
    };

    const advance =
      payments.find((p) => p.paymentMethod === "advance") || payments[0];
    const balance =
      payments.find((p) => p.paymentMethod === "balance") || payments[1];

    const advanceTotal = calculateTotal(advance);
    const balanceTotal = calculateTotal(balance);

    setFormData((prev) => ({
      ...prev,
      advancePayment: advanceTotal,
      balancePayment: balanceTotal,
    }));

    setPrepaymentTotal(advanceTotal);
    setBalanceTotal(balanceTotal);
  }, [payments]);

  useEffect(() => {
    const newTotalPrice = Object.values(selectedProducts).reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
    setTotalPrice(newTotalPrice);
    setFormData((prev) => ({ ...prev, totalPrice: newTotalPrice }));
  }, [selectedProducts]);

  const handleSubmit = async (isTemp = false) => {
    const orderItems = Object.entries(selectedProducts)
      .map(([categoryId, item]) => {
        const product = groupedProducts[categoryId]?.find(
          (p) => p.id === item.productId
        );
        return {
          product_id: item.productId,
          quantity: item.quantity,
          attributes: item.attributes,
          price: product ? product.price : 0,
        };
      })
      .filter((item) => item.product_id);

    const advance =
      payments.find((p) => p.paymentMethod === "advance") || payments[0];
    const balance =
      payments.find((p) => p.paymentMethod === "balance") || payments[1];

    const orderData = {
      ...formData,
      event_id: parseInt(event_id, 10),
      author_id: parseInt(formData.author_id, 10),
      modifier_id: parseInt(formData.author_id, 10),
      affiliation_id: parseInt(formData.affiliation_id, 10),
      totalPrice: totalPrice,
      advancePayment: formData.advancePayment,
      advancePaymentDate: payments[0].payment_date,
      balancePayment: formData.balancePayment,
      balancePaymentDate: payments[1].payment_date,
      orderItems: orderItems,
      payments: payments.map((payment) => ({
        payment_date: payment.payment_date,
        paymentMethod: payment.paymentMethod,
        cashAmount: payment.cashAmount,
        cashCurrency: payment.cashCurrency,
        cashConvertedAmount: payment.cashConvertedAmount,
        cardAmount: payment.cardAmount,
        cardCurrency: payment.cardCurrency,
        cardConvertedAmount: payment.cardConvertedAmount,
        tradeInAmount: payment.tradeInAmount,
        tradeInCurrency: payment.tradeInCurrency,
        tradeInConvertedAmount: payment.tradeInConvertedAmount,
        notes: payment.notes,
      })),
    };

    console.log(orderData);
    console.log(
      "아직 수정중에 있습니다. 데이터 반환을 확인 작업을 위해 임시로 생성 API를 막아두겠습니다."
    );

    // try {
    //   if (isTemp) {
    //     await saveTempOrderMutation.mutateAsync({
    //       orderData,
    //       isUpdate: isEdit,
    //     });
    //     onSave();
    //   } else {
    //     await saveOrderMutation.mutateAsync({
    //       orderData,
    //       isUpdate: isEdit,
    //       isTemp: false,
    //     });
    //     onComplete();
    //   }
    //   navigate(`/event/${event_id}`);
    // } catch (error) {
    //   console.error("Order save failed:", error);
    //   // 에러 처리 로직
    // }
  };

  if (
    isLoadingOrderDetails ||
    isLoadingAuthors ||
    isLoadingAffiliations ||
    isEventLoading
  )
    return <div>Loading...</div>;
  if (orderDetailsError)
    return <div>Error loading order details: {orderDetailsError.message}</div>;

  return (
    <>
      <section className={styles.sectionWrap}>
        <h3 className={styles.sectionTitle}>주문정보</h3>

        <div className={styles.sectionValueWrap}>
          <h4 className={styles.sectionLabel}>주문번호</h4>
          <p className={styles.sectionValue}>{formData.id || "새 주문"}</p>
        </div>

        <div className={styles.sectionGroupWrap}>
          <div className={styles.sectionGroup}>
            <h4 className={styles.sectionLabel}>
              {isEdit ? "수정자" : "작성자"}
            </h4>
            <select
              name="author_id"
              id={styles.writer}
              onChange={handleInputChange}
              value={formData.author_id}
            >
              <option value="">작성자 선택</option>
              {authors?.data &&
                authors?.data.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.sectionGroup}>
            <h4 className={styles.sectionLabel}>
              {isEdit ? "수정일자" : "작성일자"}
            </h4>
            <p className={styles.sectionValue}>
              {new Date().toLocaleDateString("ko-KR")}
            </p>
          </div>
          {isEdit && (
            <>
              <div className={styles.sectionGroup}>
                <h4 className={styles.sectionLabel}>작성자</h4>
                <p className={styles.sectionValue}>{orderDetails.author_id}</p>
              </div>
              <div className={styles.sectionGroup}>
                <h4 className={styles.sectionLabel}>작성일자</h4>
                <p className={styles.sectionValue}>
                  {new Date(orderDetails.created_at).toLocaleDateString(
                    "ko-KR"
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        <div className={styles.sectionGroupWrap}>
          <h4 className={styles.sectionLabel}>주문상태</h4>

          <form className={`${styles.sectionGroup} ${styles.statusWrap}`}>
            {Object.entries(ORDER_STATUS_MAP).map(([value, label]) => (
              <div key={value} className={styles.statusLable}>
                <input
                  type="radio"
                  name="status"
                  id={value}
                  value={value}
                  checked={formData.status === value}
                  onChange={handleStatusChange}
                />
                <label htmlFor={value}>{label}</label>
              </div>
            ))}
          </form>
        </div>
      </section>

      <section className={styles.sectionWrap}>
        <h3 className={styles.sectionTitle}>주문자정보</h3>

        <div className={styles.sectionGroupWrap}>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>주문자</h4>
            <Input
              type="text"
              className={styles.textInput}
              value={customerName}
              onChange={handleCustomerNameChange}
            />
          </div>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>연락처</h4>
            <Input
              type="tel"
              className={styles.textInput}
              name="contact"
              value={formData.contact}
              onChange={handleContactChange}
            />
          </div>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>소속</h4>
            <select
              name="affiliation_id"
              id={styles.relation}
              value={formData.affiliation_id}
              onChange={handleAffiliationChange}
            >
              <option value="">소속 선택</option>
              {affiliations?.data &&
                affiliations?.data.map((affiliation) => (
                  <option key={affiliation.id} value={affiliation.id}>
                    {affiliation.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className={styles.sectionGroupWrap}>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>배송지 입력</h4>
            <Input
              type="text"
              className={styles.addressInput}
              name="address"
              value={formData.address}
              onChange={handleAddressChange}
            />
          </div>

          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>수령방법</h4>
            <select
              name="collectionMethod"
              id={styles.takeout}
              value={formData.collectionMethod}
              onChange={handleCollectionMethodChange}
            >
              <option value="Delivery">배송</option>
              <option value="Pickup on site">현장수령 (기혼 불가)</option>
              <option value="Pickup in store">매장수령</option>
            </select>
          </div>
        </div>

        <div className={styles.sectionValueWrap}>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>기타사항</h4>
            <textarea
              name="notes"
              id="optionalMessage"
              className={styles.optionalMessage}
              value={formData.notes}
              onChange={handleNotesChange}
            ></textarea>
          </div>
        </div>
      </section>

      <section className={styles.sectionWrap}>
        <h3 className={styles.sectionTitle}>상품정보</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">카테고리</th>
              <th scope="col">상품명</th>
              <th scope="col">사이즈</th>
              <th scope="col">개수</th>
              <th scope="col">가격</th>
            </tr>
          </thead>
          <tbody>
            {eventData?.categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <select
                    value={selectedProducts[category.id]?.productId || ""}
                    onChange={(e) =>
                      handleProductChange(
                        category.id,
                        "productId",
                        e.target.value
                      )
                    }
                  >
                    <option value="">선택</option>
                    {groupedProducts[category.id]?.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={selectedProducts[category.id]?.attributes || ""}
                    onChange={(e) =>
                      handleProductChange(
                        category.id,
                        "attributes",
                        e.target.value
                      )
                    }
                    disabled={!selectedProducts[category.id]?.productId}
                  >
                    <option value="">선택</option>
                    {selectedProducts[category.id]?.sizes?.map((size) => (
                      <option key={size.id} value={size.value}>
                        {size.value}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <Input
                    type="number"
                    min="0"
                    value={selectedProducts[category.id]?.quantity || 1}
                    onChange={(e) =>
                      handleProductChange(
                        category.id,
                        "quantity",
                        parseInt(e.target.value, 10)
                      )
                    }
                    disabled={!selectedProducts[category.id]?.productId}
                  />
                </td>
                <td>
                  {(
                    (selectedProducts[category.id]?.price || 0) *
                    (selectedProducts[category.id]?.quantity || 0)
                  ).toLocaleString()}{" "}
                  원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.sectionWrap}>
        <h3 className={styles.sectionTitle}>결제정보</h3>

        <PaymentTable
          payment={payments[0]}
          onPaymentChange={handlePaymentChange(0)}
        />
        <PaymentTable
          payment={payments[1]}
          onPaymentChange={handlePaymentChange(1)}
        />

        <div className={styles.sectionValueWrap}>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>결제자</h4>
            <div className={styles.sectionGroup}>
              <input
                type="text"
                className={styles.textInput}
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                disabled={isPayerSameAsCustomer}
              />
              <div className={styles.sectionGroup}>
                <input
                  type="checkbox"
                  name="takeCustomerName"
                  checked={isPayerSameAsCustomer}
                  onChange={handlePayerCheckboxChange}
                />
                <label
                  htmlFor="takeCustomerName"
                  className={styles.checkboxLabel}
                >
                  주문자와 동일
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.calculator}>
          <div className={styles.spacebetween}>
            <h4 className={styles.sectionLabel}>상품 가격</h4>
            <p>{totalPrice.toLocaleString()} 원</p>
          </div>
          <div className={styles.spacebetween}>
            <h4 className={styles.sectionLabel}>선입금 총액</h4>
            <p className={styles.paid}>{prepaymentTotal.toLocaleString()} 원</p>
          </div>
          <div className={styles.spacebetween}>
            <h4 className={styles.sectionLabel}>잔금 총액</h4>
            <p className={styles.paid}>{balanceTotal.toLocaleString()} 원</p>
          </div>
          <hr className={styles.hr} />
          <div className={styles.spacebetween}>
            <h4 className={styles.sectionLabel}>총 잔액</h4>
            <p className={styles.rest}>
              {(totalPrice - prepaymentTotal - balanceTotal).toLocaleString()}{" "}
              원
            </p>
          </div>
        </div>
      </section>

      <section className={styles.sectionWrap}>
        <h3 className={styles.sectionTitle}>수선정보</h3>

        <div className={styles.sectionGroupWrap}>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>자켓 소매</h4>
            <div className={styles.sectionGroup}>
              <input
                type="number"
                className={styles.numberInput}
                name="jacketSleeve"
                value={formData.alteration_details.jacketSleeve}
                onChange={(e) =>
                  handleAlterationChange("jacketSleeve", e.target.value)
                }
              />
              {eventData?.form.jacketSleeve}
            </div>
          </div>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>자켓 기장</h4>
            <div className={styles.sectionGroup}>
              <input
                type="number"
                className={styles.numberInput}
                name="jacketLength"
                value={formData.alteration_details.jacketLength}
                onChange={(e) =>
                  handleAlterationChange("jacketLength", e.target.value)
                }
              />
              {eventData?.form.jacketLength}
            </div>
          </div>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>자켓 폼</h4>
            <div className={styles.sectionGroup}>
              <input
                type="number"
                className={styles.numberInput}
                name="jacketForm"
                value={formData.alteration_details.jacketForm}
                onChange={(e) =>
                  handleAlterationChange("jacketForm", e.target.value)
                }
              />
              {eventData?.form.jacketForm}
            </div>
          </div>
        </div>

        <div className={styles.sectionGroupWrap}>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>셔츠 목</h4>
            <div className={styles.sectionGroup}>
              <input
                type="number"
                className={styles.numberInput}
                name="shirtNeck"
                value={formData.alteration_details.shirtNeck}
                onChange={(e) =>
                  handleAlterationChange("shirtNeck", e.target.value)
                }
              />
              {eventData?.form.shirtNeck}
            </div>
          </div>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>셔츠 소매</h4>
            <div className={styles.sectionGroup}>
              <input
                type="number"
                className={styles.numberInput}
                name="shirtSleeve"
                value={formData.alteration_details.shirtSleeve}
                onChange={(e) =>
                  handleAlterationChange("shirtSleeve", e.target.value)
                }
              />
              {eventData?.form.shirtSleeve}
            </div>
          </div>
        </div>

        <div className={styles.sectionGroupWrap}>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>바지 둘레</h4>
            <div className={styles.sectionGroup}>
              <input
                type="number"
                className={styles.numberInput}
                name="pantsCircumference"
                value={formData.alteration_details.pantsCircumference}
                onChange={(e) =>
                  handleAlterationChange("pantsCircumference", e.target.value)
                }
              />
              {eventData?.form.pantsCircumference}
            </div>
          </div>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>바지 길이</h4>
            <div className={styles.sectionGroup}>
              <input
                type="number"
                className={styles.numberInput}
                name="pantsLength"
                value={formData.alteration_details.pantsLength}
                onChange={(e) =>
                  handleAlterationChange("pantsLength", e.target.value)
                }
              />
              {eventData?.form.pantsLength}
            </div>
          </div>
        </div>

        <div className={styles.sectionGroupWrap}>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>드레스 뒷품</h4>
            <div className={styles.sectionGroup}>
              <input
                type="number"
                className={styles.numberInput}
                name="dressBackForm"
                value={formData.alteration_details.dressBackForm}
                onChange={(e) =>
                  handleAlterationChange("dressBackForm", e.target.value)
                }
              />
              {eventData?.form.dressBackForm}
            </div>
          </div>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>드레스 기장</h4>
            <div className={styles.sectionGroup}>
              <input
                type="number"
                className={styles.numberInput}
                name="dressLength"
                value={formData.alteration_details.dressLength}
                onChange={(e) =>
                  handleAlterationChange("dressLength", e.target.value)
                }
              />
              {eventData?.form.dressLength}
            </div>
          </div>
        </div>

        <div className={styles.sectionValueWrap}>
          <div className={styles.sectionVerticalGroup}>
            <h4 className={styles.sectionLabel}>비고</h4>
            <textarea
              name="alterationNotes"
              id="dressOptionalMessage"
              className={styles.optionalMessage}
              value={formData.alteration_details.notes}
              onChange={(e) => handleAlterationChange("notes", e.target.value)}
            ></textarea>
          </div>
        </div>
      </section>

      <div className={styles.actionButtonsWrap}>
        <Button
          type="button"
          onClick={() => handleSubmit(true)}
          className={styles.tempSaveButton}
          variant="primary"
        >
          임시 저장
        </Button>
        <Button
          type="submit"
          className={styles.submitButton}
          onClick={() => handleSubmit(false)}
        >
          {isEdit ? "수정 완료" : "작성 완료"}
        </Button>
      </div>
    </>
  );
};

export default OrderForm;
