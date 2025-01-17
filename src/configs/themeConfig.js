// Logo Import
import logo from '@src/assets/images/logo/raf.png'

// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appName: 'سامانه مدیریت رویداد',
    appLogoImage: logo
  },
  layout: {
    isRTL: true,
    skin: 'bordered', // light, dark, bordered, semi-dark
    type: 'horizontal', // vertical, horizontal
    contentWidth: 'full', // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: false
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'sticky', // static , sticky , floating, hidden
      backgroundColor: 'white' // BS color options [primary, success, etc]
    },
    footer: {
      type: 'hidden' // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true, // Enable scroll to top button
    toastPosition: 'top-left' // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  }
}

export default themeConfig
