import React, { useState, useEffect } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import ProfessorCard from "./ProfessorCard.jsx";

function ProfessorList({ className }) {
  // TODO: API에서 실제 교수 목록 데이터를 가져와야 합니다.
  const [professors, setProfessors] = useState([
    {
      id: 3,
      name: "김교수",
      major: "컴퓨터공학과",
      position: "교수",
      office: "공학관 301호",
    },
    {
      id: 4,
      name: "이교수",
      major: "데이터베이스",
      position: "부교수",
      office: "공학관 305호",
    },
    {
      id: 5,
      name: "박교수",
      major: "웹개발, 클라우드",
      position: "조교수",
      office: "IT관 202호",
    },
  ]);

  const handleSearch = () => {
    // TODO: 검색 및 필터링 API 호출 로직 구현
    console.log("검색 실행");
  };

  return (
    <Card className={className}>
      <Card.Body>
        <Card.Title as="h2" className="h5 mb-4">
          🧑‍🏫 교수 목록
        </Card.Title>

        {/* 검색 및 필터 폼 */}
        <Form className="mb-4">
          <Row className="g-2">
            <Col md>
              <Form.Control
                type="text"
                placeholder="교수명, 학과, 전문분야로 검색..."
              />
            </Col>
            <Col md="auto">
              <Form.Select>
                <option value="">전체 학과</option>
                <option value="컴퓨터공학과">컴퓨터공학과</option>
                <option value="전기공학과">전기공학과</option>
              </Form.Select>
            </Col>
            <Col md="auto" className="d-none d-md-block">
              <Button variant="primary" onClick={handleSearch}>
                검색
              </Button>
            </Col>
          </Row>
        </Form>

        {/* 교수 카드 그리드 */}
        <Row xs={1} md={2} lg={3} className="g-4">
          {professors.map((prof) => (
            <Col key={prof.id}>
              <ProfessorCard professor={prof} type="list" />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}

export default ProfessorList;
