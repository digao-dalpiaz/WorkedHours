import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Moment from "moment";
import { useLocation } from "react-router-dom";

export default function Calc() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const FMT = 'HH:mm';

  const [list, setList] = useState([{}, {}]);

  const [required, setRequired] = useState(queryParams.get('req') || '');

  return (
    <Container>
      <h1>Worked Hours Calc</h1>
      <br />

      <Card>
        <Card.Header>
          <b>Worked intervals</b>
        </Card.Header>
        <Card.Body>
          {list.map((x, index) =>
            <Row key={index}>
              <Col>
                <span>In:</span>
                <input type="time" className="form-control" value={x.in || ''} onChange={ev => updateField(x, 'in', ev.target.value)} />
              </Col>
              <Col>
                <span>Out:</span>
                <input type="time" className="form-control" value={x.out || ''} onChange={ev => updateField(x, 'out', ev.target.value)} />
              </Col>
              <Col>
                <span>Sum:</span>
                <input type="text" className="form-control" disabled value={fmtDuration(getItemSum(x))} />
              </Col>
              <Col>
                <br />
                <Button variant="danger" onClick={() => remove(x)}>Remove</Button>
              </Col>
            </Row>)}

          <br />
          <Button onClick={add}>Add Interval</Button>
        </Card.Body>
        <Card.Footer>
          <div className="text-end"><b>Total:</b> {getTotal()}</div>
        </Card.Footer>
      </Card>

      <br />

      <Card>
        <Card.Header>
          <b>Estimated time to leave</b>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <span>Required amount time:</span>
              <input type="time" className="form-control" value={required} onChange={ev => setRequired(ev.target.value)} />
            </Col>
            <Col>
              <span>You should left at:</span>
              <input type="text" className="form-control" disabled value={getLeftTime()} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

    </Container>
  )

  function updateField(obj, fieldName, value) {
    const newList = list.map(item => {
      if (item === obj) {
        return { ...item, [fieldName]: value };
      }
      return item;
    });

    setList(newList);
  };

  function add() {
    setList([...list, {}])
  }

  function remove(item) {
    setList(list.filter(x => x !== item))
  }

  function getItemSum(item) {
    if (!item.in || !item.out) return null;

    const hIn = Moment(item.in, FMT);
    const hOut = Moment(item.out, FMT);

    return Moment.duration(hOut.diff(hIn));
  }

  function fmtDuration(dur) {
    if (!dur) return '';

    return Math.floor(dur.asHours()) + ':' + dur.minutes().toString().padStart(2, '0');
  }

  function getTotal() {
    const dur = Moment.duration(0);

    list.forEach(item => dur.add(getItemSum(item)));

    return fmtDuration(dur);
  }

  function getLeftTime() {
    if (!required || list.length === 0) return '';

    const dur = Moment.duration(0);

    for (let i = 0; i < list.length; i++) {
      if (i === list.length - 1) {
        //last item
        const durReq = Moment.duration(required);
        if (dur > durReq) return 'You are working too much!';

        const durToFinish = durReq.subtract(dur);

        const txtIn = list[i].in;
        if (!txtIn) return 'Missing last incoming time';
        const hIn = Moment(txtIn, FMT);

        return hIn.add(durToFinish).format(FMT);
      } else {
        dur.add(getItemSum(list[i]));
      }
    }

    throw new Error('Should not be here!');
  }

}