import dayjs from 'dayjs'

export const durationSprintInDays = 14
export const sprintStartAt = dayjs()
export const sprintFinishAt = dayjs().add(durationSprintInDays - 1, 'day')

export const sprints = [
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    number: 1,
    start_at: sprintStartAt.format('YYYY-MM-DD'),
    finish_at: sprintFinishAt.format('YYYY-MM-DD'),
    created_at: '2023-03-27T11:04:02.366662+00:00'
  }
]

export const tasks = [
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    sprint_id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    name: 'Сходить в магазин',
    description: 'Купить продукты, бытовую химию и подарки',
    is_done: false,
    planned_at: null,
    created_at: '2023-03-27T11:04:02.366662+00:00'
  },
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3bb2f5423',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    sprint_id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    name: 'Погладить вещи',
    description: '',
    is_done: false,
    planned_at: null,
    created_at: '2023-03-28T11:04:02.366662+00:00'
  },
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3bb2f5423',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    sprint_id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    name: 'Починить кран в ванной',
    description: '',
    is_done: false,
    planned_at: sprintStartAt.format('YYYY-MM-DD'),
    created_at: '2023-03-23T11:04:02.366662+00:00'
  },
  {
    id: 'c3fcd82c-4382-451b-85b6-68a3bb2f5741',
    user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
    sprint_id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
    name: 'Посетить выставку',
    description: 'Заказать билеты через онлайн кассу',
    is_done: false,
    planned_at: sprintFinishAt.format('YYYY-MM-DD'),
    created_at: '2023-03-27T11:04:02.366662+00:00'
  }
]

export const newTask = {
  id: 'c3fcd82c-4382-451b-85b6-68a3342df1',
  user_id: '27c41dc4-d70f-4efa-9ed0-ded37d5be096',
  sprint_id: 'c3fcd82c-4382-451b-85b6-68a3bb2f575f',
  name: 'Сделать домашнее задание',
  description: 'Выполнить упражнения с 5 по 7 в тренажере',
  is_done: false,
  planned_at: sprintStartAt.add(durationSprintInDays - 3, 'day').format('YYYY-MM-DD'),
  created_at: '2023-03-27T11:04:02.366662+00:00'
}
