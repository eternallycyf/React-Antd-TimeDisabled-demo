import { useState } from 'react'
import moment from 'moment'
import { Form, DatePicker } from 'antd'
const { RangePicker } = DatePicker;
import ToolClass from '../toolClass'
const Picker2 = () => {
  const [form] = Form.useForm();
  const transformFn = new ToolClass()
  const [disabledTimeDates, setDisabledTimeDates] = useState([]);
  // 将表单分为 startTime1 startTime2  endTime1 endTime2
  const disabledRangeTime = (CurrentFormMoment: moment.MomentInput, type: string) => {
    // startTime1
    let StartTime1 = form.getFieldValue('startTime')?.[0];
    // endTime1
    let endTime1 = disabledTimeDates?.[0];
    if (type === 'start') {
      return transformFn.disabledTime(StartTime1, CurrentFormMoment)
    }
    if (type === 'end') {
      return transformFn.disabledTime(endTime1, CurrentFormMoment)
    }
    return {}
  };
  const disabledRangeDate = (CurrentFormMoment: moment.MomentInput) => {
    let StartTime = form.getFieldValue('startTime')?.[0];
    return transformFn.disabledDate(StartTime, CurrentFormMoment);
  }
  return (
    <>
      <h2>Picker2</h2>
      <Form form={form}>
        <Form.Item name='startTime'>
          <RangePicker
            onChange={() => form.setFieldsValue({ endTime: null })}
            showTime={{
              hideDisabledOptions: true
            }}
          />
        </Form.Item>
        <Form.Item name='endTime'>
          <RangePicker
            onCalendarChange={(val: any) => setDisabledTimeDates(val)}
            disabledDate={disabledRangeDate}
            disabledTime={disabledRangeTime}
            showTime={{
              hideDisabledOptions: true
            }}
          />
        </Form.Item>
      </Form>
    </>
  )
}
export default Picker2