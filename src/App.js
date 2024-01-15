import "./App.css";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import { db } from "./firebase";
import { collection, addDoc, updateDoc, getDocs } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [randomNumbers1, setRandomNumbers1] = useState([]);
  const [randomNumbersNear, setRandomNumbersNear] = useState([]);
  const [randomNumbers2, setRandomNumbers2] = useState([]);
  const [randomNumbers2_1, setRandomNumbers2_1] = useState([]);
  const [randomNumbers2_2, setRandomNumbers2_2] = useState([]);
  const [randomNumbersEnd, setRandomNumbersEnd] = useState([]);
  const [winnerMessage, setWinnerMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "lucky-number"));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
  
          setRandomNumbers1(data.randomNumbers1);
          setRandomNumbersNear(data.randomNumbersNear);
          setRandomNumbers2(data.randomNumbers2);
          setRandomNumbers2_1(data.randomNumbers2_1);
          setRandomNumbers2_2(data.randomNumbers2_2);
          setRandomNumbersEnd(data.randomNumbersEnd);
        }
      } catch (e) {
        console.error("Error fetching data from Firestore:", e);
      }
    };
  
    fetchData();
  }, []);


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCheckResult = () => {
    setShowResult(true);

    const userEnteredNumber = searchTerm.trim();

    let resultMessage = userEnteredNumber + " ";
    let errorMessage = "";
    const allRandomNumbers2 = [
      randomNumbers2.join(""),
      randomNumbers2_1.join(""),
      randomNumbers2_2.join(""),
    ];

    const userEnteredNumberPart1 = userEnteredNumber.substring(1);
    const userEnteredNumberPart2 = userEnteredNumber.substring(2);
    const isEndNumberWinner = randomNumbersEnd.some(
      (endNumber) =>
        endNumber.includes(userEnteredNumberPart1) &&
        endNumber.includes(userEnteredNumberPart2)
    );

    // ตรวจสอบ validation
    if (userEnteredNumber === "") {
      errorMessage = "กรุณากรอกตัวเลข";
      setWinnerMessage(errorMessage);
    } else if (
      userEnteredNumber.length !== 3 ||
      !/^\d+$/.test(userEnteredNumber)
    ) {
      errorMessage = "กรุณากรอกตัวเลข 3 ตัว";
      setWinnerMessage(errorMessage);
    } else {
      // ตรวจสอบรางวัลที่ 1
      if (userEnteredNumber === randomNumbers1.join("")) {
        resultMessage += "รางวัลที่ 1 ";
      }

      if (randomNumbersNear.includes(userEnteredNumber)) {
        resultMessage += "รางวัลใกล้เคียงรางวัลที่ 1 ";
      }

      // ตรวจสอบรางวัลที่ 2
      if (allRandomNumbers2.includes(userEnteredNumber)) {
        resultMessage += "รางวัลที่ 2 ";
      }

      // ตรวจสอบรางวัลเลขท้าย 2 ตัว
      if (isEndNumberWinner) {
        resultMessage += "รางวัลเลขท้าย 2 ตัว ";
      }

      if (!resultMessage.includes("รางวัล")) {
        resultMessage += "ไม่ถูกรางวัลใดๆ";
      }
      setWinnerMessage(resultMessage);
    }
  };

  const randomNumbersInRange = (min, max, count) => {
    const numbers = [];
    for (let i = 0; i < count; i++) {
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      numbers.push(randomNum);
    }
    return numbers;
  };

  const handleDrawNumbers = async () => {
    // สุ่มเลขสำหรับรางวัลที่ 1 (3 ตัว)
    const numbers1 = randomNumbersInRange(0, 9, 3).map((num) =>
      num.toString().padStart(1, "0")
    );
    setRandomNumbers1(numbers1);

    // สุ่มเลขสำหรับรางวัลใกล้เคียง (2 ชุด)
    const baseNumbers = numbers1.join("");
    setRandomNumbersNear([
      (parseInt(baseNumbers) - 1).toString().padStart(3, "0"),
      (parseInt(baseNumbers) + 1).toString().padStart(3, "0"),
    ]);

    // สุ่มเลขสำหรับรางวัลที่ 2 (3 ชุด)
    const numbers2 = randomNumbersInRange(0, 9, 3).map((num) =>
      num.toString().padStart(1, "0")
    );
    const numbers2_1 = randomNumbersInRange(0, 9, 3).map((num) =>
      num.toString().padStart(1, "0")
    );
    const numbers2_2 = randomNumbersInRange(0, 9, 3).map((num) =>
      num.toString().padStart(1, "0")
    );
    setRandomNumbers2(numbers2);
    setRandomNumbers2_1(numbers2_1);
    setRandomNumbers2_2(numbers2_2);

    // สุ่มเลขสำหรับรางวัลเลขท้าย 2 ตัว (1 ชุด)
    const lastnumber = randomNumbersInRange(0, 99, 1).map((num) =>
      num.toString().padStart(2, "0")
    );
    setRandomNumbersEnd(lastnumber);

    try {
      const querySnapshot = await getDocs(collection(db, "lucky-number"));
      if(querySnapshot.empty){
        const docRef = await addDoc(collection(db, "lucky-number"), {
          randomNumbers1: numbers1,
          randomNumbersNear: [
            (parseInt(baseNumbers) - 1).toString().padStart(3, "0"),
            (parseInt(baseNumbers) + 1).toString().padStart(3, "0"),
          ],
          randomNumbers2: numbers2,
          randomNumbers2_1: numbers2_1,
          randomNumbers2_2: numbers2_2,
          randomNumbersEnd: lastnumber,
        });
        console.log(docRef.id);
        console.log(randomNumbers1);
      }else{
        const doc = querySnapshot.docs[0]; 
        await updateDoc(doc.ref, {
          randomNumbers1: numbers1,
          randomNumbersNear: [
            (parseInt(baseNumbers) - 1).toString().padStart(3, "0"),
            (parseInt(baseNumbers) + 1).toString().padStart(3, "0"),
          ],
          randomNumbers2: numbers2,
          randomNumbers2_1: numbers2_1,
          randomNumbers2_2: numbers2_2,
          randomNumbersEnd: lastnumber,
        });
        
      }
        
        
      }
     catch (e) {
      console.error("Error:", e);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>รางวัลล็อตเตอรี่ Diversition</p>
      </header>
      <body>
        <h2 className="resultLabel">ผลการออกรางวัลล็อตเตอรี่ Diversition</h2>
        <Button variant="primary" onClick={handleDrawNumbers}>
          ดำเนินการสุ่มรางวัล
        </Button>
        <div className="container mt-5">
          <Table striped bordered hover variant="white">
            <thead>
              <tr>
                <th scope="col">รางวัล</th>
                <th scope="col">หมายเลข</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>รางวัลที่ 1</td>
                <td>{randomNumbers1}</td>
              </tr>
              <tr>
                <td>รางวัลข้างเคียงรางวัลที่ 1</td>
                <td>{randomNumbersNear.join(" ")}</td>
              </tr>
              <tr>
                <td>รางวัลที่ 2</td>
                <td>
                  {handleDrawNumbers &&
                    randomNumbers2.join("") +
                      " " +
                      randomNumbers2_1.join("") +
                      " " +
                      randomNumbers2_2.join("")}
                </td>
              </tr>
              <tr>
                <td>รางวัลเลขท้าย 2 ตัว</td>
                <td>{randomNumbersEnd}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div>
          <h2>ตรวจรางวัลล็อตเตอรี่ Diversition</h2>
          <Form.Group controlId="searchTerm">
            <Form.Label>เลขล็อตเตอรี่: </Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                type="text"
                placeholder="กรุณาใส่เลข3หลัก"
                value={searchTerm}
                onChange={handleSearch}
                
              />
            </InputGroup>
          </Form.Group>
        </div>
        {showResult && <h3 className="resultMessage">{winnerMessage}</h3>}

        <Button variant="success" onClick={handleCheckResult}>
          ตรวจรางวัล
        </Button>
      </body>
    </div>
  );
}

export default App;
