// button
import XButton from './button/button.vue'

// card
import XCard from './card/card.vue'
import XCardTitle from './card/card-title.vue'
import XCardText from './card/card-text.vue'
import XCardLink from './card/card-link.vue'
import XCardBlock from './card/card-block.vue'
import XCardImage from './card/card-image.vue'

// drop down
import XDropDown from './drop-down/drop-down.vue'
import XDropDownMenu from './drop-down/drop-down-menu.vue'
import XDropDownMenuDivider from './drop-down/drop-down-menu-divider.vue'
import XDropDownItem from './drop-down/drop-down-menu-item.vue'

// tabs
import XTabs from './tabs/tabs.vue'
import XTab from './tabs/tab.vue'

// date picker
import XDatePicker from './date-picker/date-picker.vue'

// directives
import XDateTimePicker from './date-picker/date-time-picker'

export const components = {
  XButton,

  XCard,
  XCardTitle,
  XCardText,
  XCardLink,
  XCardBlock,
  XCardImage,

  XDropDown,
  XDropDownMenu,
  XDropDownMenuDivider,
  XDropDownItem,

  XTabs,
  XTab,

  XDatePicker
}

export const directives = {
  XDateTimePicker
}

export default {

  install(Vue) {
    Object.keys(components).forEach((name) => {
      Vue.component(name, components[name])
    })
    Object.keys(directives).forEach((name) => {
      Vue.directive(name, directives[name])
    })
  }

}
