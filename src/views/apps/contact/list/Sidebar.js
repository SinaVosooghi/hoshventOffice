// ** React Import
import { useState } from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input } from 'reactstrap'

// ** Store & Actions
import { addUser } from '../store'
import { useDispatch } from 'react-redux'

const defaultValues = {
  email: '',
  contact: '',
  company: '',
  fullName: '',
  username: '',
  country: null
}

const countryOptions = [
  { label: 'Australia', value: 'Australia' },
  { label: 'Bangladesh', value: 'Bangladesh' },
  { label: 'Belarus', value: 'Belarus' },
  { label: 'Brazil', value: 'Brazil' },
  { label: 'Canada', value: 'Canada' },
  { label: 'China', value: 'China' },
  { label: 'France', value: 'France' },
  { label: 'Germany', value: 'Germany' },
  { label: 'India', value: 'India' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Israel', value: 'Israel' },
  { label: 'Italy', value: 'Italy' },
  { label: 'Japan', value: 'Japan' },
  { label: 'Korea', value: 'Korea' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Philippines', value: 'Philippines' },
  { label: 'Russia', value: 'Russia' },
  { label: 'South', value: 'South' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Turkey', value: 'Turkey' },
  { label: 'Ukraine', value: 'Ukraine' },
  { label: 'United Arab Emirates', value: 'United Arab Emirates' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'United States', value: 'United States' }
]

const checkIsValid = data => {
  return Object.values(data).every(field => (typeof field === 'object' ? field !== null : field.length > 0))
}

const SidebarNewUsers = ({ open, toggleSidebar }) => {
  // ** States
  const [data, setData] = useState(null)
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')

  // ** Store Vars
  const dispatch = useDispatch()

  // ** Vars
  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = data => {
    setData(data)
    if (checkIsValid(data)) {
      toggleSidebar()
      dispatch(
        addUser({
          role,
          avatar: '',
          status: 'active',
          email: data.email,
          currentPlan: plan,
          billing: 'auto debit',
          company: data.company,
          contact: data.contact,
          fullName: data.fullName,
          username: data.username,
          country: data.country.value
        })
      )
    } else {
      for (const key in data) {
        if (data[key] === null) {
          setError('country', {
            type: 'manual'
          })
        }
        if (data[key] !== null && data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, '')
    }
    setRole('subscriber')
    setPlan('basic')
  }

  return (
    <Sidebar
      open={open}
      title='کاربر جدید'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-1'>
          <Label className='form-label' for='fullName'>
            نام و نام خانوادگی <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='fullName'
            control={control}
            render={({ field }) => (
              <Input id='fullName' placeholder='حسین رضایی' invalid={errors.fullName && true} {...field} />
            )}
          />
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='userEmail'>
            ایمیل <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                type='email'
                id='userEmail'
                placeholder='john.doe@example.com'
                invalid={errors.email && true}
                {...field}
              />
            )}
          />
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='contact'>
            موبایل <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='contact'
            control={control}
            render={({ field }) => (
              <Input id='contact' placeholder='۰۹۱۲۱۲۳۴۵۶۷' invalid={errors.contact && true} {...field} />
            )}
          />
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='country'>
            شهر <span className='text-danger'>*</span>
          </Label>
          <Controller
            name='country'
            control={control}
            render={({ field }) => (
              <Select
                isClearable={false}
                classNamePrefix='select'
                options={countryOptions}
                theme={selectThemeColors}
                className={classnames('react-select', { 'is-invalid': data !== null && data.country === null })}
                {...field}
              />
            )}
          />
        </div>


        <Button type='submit' className='me-1' color='primary'>
          ثبت
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewUsers
