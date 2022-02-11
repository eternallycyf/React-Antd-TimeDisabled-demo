## 1.关于该仓库 
- 工作中经常碰到业务需求是 
- 两个时间组件 要求第二个的时间不能超过前一个的时间
- 如果是只限制日期就很简单 官网直接复制就行
- 但当掺杂了时分秒后 就不是很清晰了
- 因此 在这里把常用 关于时间禁用的方法封装成了一个类
- 以方便查找调用

## 2.仓库具有完整的demo和注释 使用方式简单

## 3.后续有空就会封装的方法
- 7天范围
- 禁用指定年月日
- 禁用指定时分秒
- 组合禁用 7天范围 禁用指定年月日 禁用指定时分秒
- 还有别的常用的需求可以 @ 下

![avatar](https://wangxince.site/React-Antd-TimeDisabled-demo/src/public/image1.jpg)
![avatar](https://wangxince.site/React-Antd-TimeDisabled-demo/src/public/image2.jpg)

## 4.两个DatePicker交互
```js
import moment from 'moment'
import { Form, DatePicker } from 'antd'
import ToolClass from '../toolClass'
const Picker1 = () => {
  const [form] = Form.useForm();
  const transformFn = new ToolClass()
  const disabledTime = (CurrentFormMoment: moment.MomentInput) => {
    const StartTime = form.getFieldValue('startTime')
    return transformFn.disabledTime(StartTime, CurrentFormMoment)
  }
  const disabledDate = (CurrentFormMoment: moment.MomentInput) => {
    const StartTime = form.getFieldValue('startTime')
    return transformFn.disabledDate(StartTime, CurrentFormMoment)
  }
  return (
    <>
      <h2>Picker1</h2>
      <Form form={form}>
        <Form.Item name='startTime'>
          <DatePicker
            style={{ minWidth: '100%' }}
            showToday={false}
            showTime
            showNow={false}
            onChange={() => form.setFieldsValue({ endTime: null })}
          />
        </Form.Item>
        <Form.Item name='endTime'>
          <DatePicker
            style={{ minWidth: '100%' }}
            showToday={false}
            showTime={{
              hideDisabledOptions: true
            }}
            showNow={false}
            disabledDate={disabledDate}
            disabledTime={disabledTime}
          />
        </Form.Item>
      </Form>
    </>
  )
}
export default Picker1
```

## 5.两个RangePicker交互
```js
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
```

## 6.class
```typescript
import moment from 'moment';
export default class ToolClass {
  protected _range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledDate = (startTime: moment.MomentInput, current: moment.MomentInput) => {
    if (startTime == undefined) {
      return false;
    }
    if (current) {
      return current < moment(startTime).startOf('days')
    }
    return false
  };
  disabledTime = (StartFormMoment: moment.MomentInput, CurrentFormMoment: moment.MomentInput) => {
    let startHours = moment(StartFormMoment).hour()
    let startMinutes = moment(StartFormMoment).minute()
    let startSeconds = moment(StartFormMoment).second()
    let startDate = moment(StartFormMoment).date()

    let currentHours = moment(CurrentFormMoment).hour()
    let currentMinutes = moment(CurrentFormMoment).minute()
    let currentDate = moment(CurrentFormMoment).date()
    if (CurrentFormMoment == undefined) {
      return {};
    }
    if (CurrentFormMoment && currentDate === startDate) {
      if (currentHours === startHours) {
        if (currentMinutes === startMinutes) {
          return {
            disabledHours: () => this._range(0, startHours),
            disabledMinutes: (selectedHour: number) => selectedHour >= startHours ? this._range(0, startMinutes) : [],
            disabledSeconds: (selectedHour: number, selectedMinute: number) =>
              selectedHour >= startHours && selectedMinute >= startMinutes
                ? this._range(0, startSeconds)
                : []
          };
        }
        return {
          disabledHours: () => this._range(0, startHours),
          disabledMinutes: (selectedHour: any) => selectedHour >= startHours ? this._range(0, startMinutes) : [],
          disabledSeconds: () => []
        }
      } else {
        return {
          disabledHours: () => this._range(0, startHours),
          disabledMinutes: () => [],
          disabledSeconds: () => []
        };
      }
    }
    return {}
  }
}
```
