import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Button, Modal, Table } from "react-bootstrap";
import SpinnerDiv from "./SpinnerDiv";
import Breadcrumbs from "./Breadcrumbs";
import { getOrderDetailsByUserId, getUserById } from "../api/api";

const MyAccount = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const [user, setUser] = useState();
  const [myOrder, setMyOrder] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [modalState, setModalState] = useState({
    show: false,
    target: "",
    title: "",
    content: "",
  });
  const handleClose = () => setModalState({ ...modalState, "show": false });
  const handleShow = async (target, title, content) => {
    setModalState({
      "target": target,
      "title": title,
      "content": content,
      "show": true
    })
  };

  const DetailModal = () => {
    return <Modal show={modalState.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalState.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalState.content}</Modal.Body>
    </Modal>
  }

  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    // const getUser = async () => {
    //   try {
    //     const res = await getUserById(currentUser?.userId)
    //     res.data && setUser(res.data[0])
    //     console.log("res.data", res.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    const getOrderDetails = async () => {
      setIsFetching(true)
      try {
        const res = await getUserById(currentUser?.userId)
        res.data && setUser(res.data[0])
        const result = await getOrderDetailsByUserId(currentUser?.userId)
        result.data && setMyOrder(result.data)
        setIsFetching(false)
      } catch (error) {
        setIsFetching(false)
        console.log(error.response.data);
      }
    }
    currentUser && getOrderDetails()
  }, [currentUser]);
  return (
    <Container fluid="xl">
      <Breadcrumbs />
      <div className="border border-2 shadow-sm p-3 mt-4">
        <h3 className="my-3">Personal Details</h3>
        <p><span className="fw-bolder me-2">First Name:</span>{user?.firstName}</p>
        <p><span className="fw-bolder me-2">Last Name:</span>{user?.lastName}</p>
        <p><span className="fw-bolder me-2">Email:</span>{user?.email}</p>
        <Button variant="link" className="text-decoration-underline ps-0"
          onClick={() => handleShow("userDetails", "Personal Details", "here should be personal details")}>Change my personal details</Button>
      </div>
      <div className="border border-2 shadow-sm p-3 my-4">
        <h3>My Orders</h3>
        {isFetching ?
          <SpinnerDiv /> :
          <Table className="shadow-sm mb-5 bg-body rounded text-secondary">
            <thead className="bg-success small bg-opacity-10">
              <tr>
                <th>ORDERID</th>
                <th className="d-none d-md-table-cell">DATE</th>
                <th>STATUS</th>
                <th>AMOUNT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {myOrder.length === 0 ?
                <tr><td> You haven't placed any order yet</td></tr> :
                myOrder?.map(order => <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td className="d-none d-md-table-cell">{order.orderDate.split("T")[0]}</td>
                  <td>{order.orderStatus}</td>
                  <td>${order.orderAmount / 100}</td>
                  <td>
                    <Button variant="light" onClick={() => handleShow("orderDetails", "Order Details", "here should be order details")}>
                      Details
                    </Button>
                  </td>
                </tr>
                )}
            </tbody>
          </Table>}
      </div>
      <DetailModal />
    </Container>
  )
}

export default MyAccount;