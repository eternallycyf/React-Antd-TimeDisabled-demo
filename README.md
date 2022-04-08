## 1.关于该仓库 
- 工作中经常碰到业务需求是 
- 两个时间组件 要求第二个的时间不能超过前一个的时间
- 如果是只限制日期就很简单 官网直接复制就行
- 但当掺杂了时分秒后 就不是很清晰了
- 因此 在这里把常用 关于时间禁用的方法封装成了一个类
- 以方便查找调用
- 然后总结了一些Bug的解决

## 2.仓库具有完整的demo和注释

## 3.后续有空就会封装的方法
- 7天范围
- 禁用指定年月日
- 禁用指定时分秒
- 组合禁用 7天范围 禁用指定年月日 禁用指定时分秒
- 还有别的常用的需求可以 @ 下

![avatar](https://github.com/eternallycyf/React-Antd-TimeDisabled-demo/blob/main/src/public/image1.png?raw=true)
![avatar](https://github.com/eternallycyf/React-Antd-TimeDisabled-demo/blob/main/src/public/image2.png?raw=true)

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
  const [disabledTimeDates1, setDisabledTimeDates1] = useState([]);
  const [disabledTimeDates2, setDisabledTimeDates2] = useState([]);
  // 将表单分为 startTime1 startTime2  endTime1 endTime2
  const disabledRangeTime1 = (CurrentFormMoment: moment.MomentInput, type: string) => {
    let StartTime1 = disabledTimeDates1?.[0];
    if (type === 'end') {
      return transformFn.disabledTime(StartTime1, CurrentFormMoment)
    }
    return {}
  };
  const disabledRangeTime2 = (CurrentFormMoment: moment.MomentInput, type: string) => {
    // startTime1
    let StartTime1 = form.getFieldValue('startTime')?.[0];
    // endTime1
    let endTime1 = disabledTimeDates2?.[0];
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
            onCalendarChange={(val: any) => setDisabledTimeDates1(val)}
            disabledTime={disabledRangeTime1}
            showTime={{
              hideDisabledOptions: true
            }}
          />
        </Form.Item>
        <Form.Item name='endTime'>
          <RangePicker
            onCalendarChange={(val: any) => setDisabledTimeDates2(val)}
            disabledDate={disabledRangeDate}
            disabledTime={disabledRangeTime2}
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

## 禁用年
```js
 <DatePicker format="YYYY" disabledDate={disabledYear} />
 function disabledYear(current) {
  return current.year() === 2021; // disabling 2021
  // return current.year() !== 2021; // disabling everything besides 2021
  // return current.year() !== (new Date).getFullYear(); // disabling everything besides current year
  // return current.year() > 2021; // disabling everything further than 2021
  // return current.year() < 2021; // disabling everything in the past before 2021
  // return [2018, 2019].includes(current.year()); // disabling 2018 and 2019
}
```


## Bug
```js
# 1. 动态设置showTime.defaultValue
当点击时间选择框会默认 选择当前的时间。但是禁用关系和它冲突的时候就需要定义defaultValue
defaultValue 只会渲染一次 因此只能写一个固定值值
如果想传入变量 需要对该组件进行重新渲染
解决方法: 直接利用 Form.Item shouldUpdate 方法进行 动态条件渲染
在Form.Item内部通过注入的 getFieldValue 方法来拿到最新的值
<Form.Item shouldUpdate={(pre, cru) => cru.xxx != pre.xxx }>
{({ getFieldValue }) => {
  return (
    <Form.Item name='xxx'>
      <DatePicker 
        showTime={{
          defaultValue: moment(
            getFieldValue('xxx') == null
              ? moment().add(2, 'hours').format('HH:00:00')
              : moment(getFieldValue('xxx')).add(1, 'hours').format('HH:00:00'),
            'HH:mm:ss')
        }}
      />
    </Form.Item>
  )
}
</Form.Item>
# 2. 当时范围选择器的时候
onChange拿不到全部的两个值
需要配置   
value={" "}
# 3. 时间组件点击后出现的弹窗 直接点时分秒 不先选择日期
GitHub: https://github.com/ant-design/ant-design/issues/29023#ref-issue-793154283
就会直接选中当天的时分秒 与禁用规则相冲突 
目前这个是个组件库的Bug 还没有解决
目前我的解决方法 直接onOk钩子函数中 判断时间是否正确 时间不对直接重置 弹框警告
# 4. ant-vue 禁用年份无法成功
需要升级到最新版 "ant-design-vue": "^1.7.8",
```
