// ** Third Party Components
import { t } from 'i18next'
import { MoreHorizontal } from 'react-feather'

const VerticalNavMenuSectionHeader = ({ item }) => {
  return (
    <li className='navigation-header'>
      <span>{t(item.header)}</span>
      <MoreHorizontal className='feather-more-horizontal' />
    </li>
  )
}

export default VerticalNavMenuSectionHeader
