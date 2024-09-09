import React, { useEffect, useState } from 'react'
import { Pagination } from "../../modules/Pagination/Pagination"
import styles from "./Event.module.css"
import { Link } from '../../components'
import axiosInstance from '../../api/axios'

const data = [
  {
    "id": 1,
    "title": "2021 행사",
    "new_order": "/event/1/create",
    "order_list": "/event/1",
    "start_date": "2023. 5. 15.",
    "end_date": "2023. 5. 20."
  },
  {
    "id": 2,
    "title": "2022 행사",
    "new_order": "/event/2/create",
    "order_list": "/event/2",
    "start_date": "2023. 8. 3.",
    "end_date": "2023. 8. 7."
  },
  {
    "id": 3,
    "title": "2023 행사",
    "new_order": "/event/3/create",
    "order_list": "/event/3",
    "start_date": "2023. 11. 22.",
    "end_date": "2023. 11. 25."
  },
  {
    "id": 4,
    "title": "2024 행사",
    "new_order": "/event/4/create",
    "order_list": "/event/4",
    "start_date": "2024. 2. 14.",
    "end_date": "2024. 2. 18."
  },
  {
    "id": 5,
    "title": "2025 행사",
    "new_order": "/event/5/create",
    "order_list": "/event/5",
    "start_date": "2024. 6. 7.",
    "end_date": "2024. 6. 10."
  },
  {
    "id": 6,
    "title": "2026 행사",
    "new_order": "/event/6/create",
    "order_list": "/event/6",
    "start_date": "2024. 9. 18.",
    "end_date": "2024. 9. 22."
  },
  {
    "id": 7,
    "title": "2027 행사",
    "new_order": "/event/7/create",
    "order_list": "/event/7",
    "start_date": "2024. 12. 1.",
    "end_date": "2024. 12. 5."
  },
  {
    "id": 8,
    "title": "2028 행사",
    "new_order": "/event/8/create",
    "order_list": "/event/8",
    "start_date": "2025. 3. 10.",
    "end_date": "2025. 3. 15."
  }
]

export const Event = () => {
  const [currentPage, setCurrentPage] = useState(1)
    //  const [eventList, setEventList] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState(null);
     const itemsPerPage = 5

    //  useEffect(() => {
    //   const fetchData = async () => {
    //     setIsLoading(true);
    //     try {
    //       const res = await axiosInstance.get("/event");
    //       console.log('Response data:', res.data);
    //       if (res.status === 200) {
    //         setEventList(Array.isArray(res.data) ? res.data : []);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching events:", error);
    //       if (error.response) {
    //         console.error("Error response:", error.response);
    //       }
    //       setError("이벤트 데이터를 불러오는 데 실패했습니다.");
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };

    //    fetchData();
    //  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className={styles.eventTableBackground}>
      <section className={styles.tableWrap}>
        <h2 className={styles.tableTitle}>현재 진행중인 대회 목록</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">제목</th>
              <th scope="col">시작기간</th>
              <th scope="col">종료기간</th>
              <th scope="col">주문서 작성</th>
              <th scope="col">주문서 목록</th>
            </tr>
          </thead>
          <tbody>
            {
            // isLoading ? (
            //   <tr>
            //     <td colSpan="5" className={styles.loadingMessageWrap}>행사 데이터를 불러오는 중입니다...</td>
            //   </tr>
            // ) : error ? (
            //   <tr>
            //     <td colSpan="5" className={styles.errorMessageWrap}>{error}</td>
            //   </tr>
            // ) : currentItems.length > 0 ? (
              currentItems.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.start_date}</td>
                  <td>{event.end_date}</td>
                  <td>
                    <Link to={event.new_order} className={styles.link}>주문서 작성</Link>
                  </td>
                  <td>
                    <Link to={event.order_list} className={styles.link}>주문서 목록 이동</Link>
                  </td>
                </tr>
              ))
            // ) : (
            //   <tr>
            //     <td colSpan="5" className={styles.noDataMessageWrap}>표시할 이벤트가 없습니다.</td>
            //   </tr>
            // )
            }
          </tbody>
        </table>
        {!isLoading && !error && data.length > 0 && (
          <Pagination
            className={styles.pagination}
            currentPage={currentPage}
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  )
}