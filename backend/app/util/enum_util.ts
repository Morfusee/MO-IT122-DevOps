import { Template } from '#models/message_pair'

export default class EnumUtil {
  static getTemplateFromString(template: string): Template {
    if (template in Template) {
      return Template[template as keyof typeof Template]
    }

    const match = Object.values(Template).find((val) => val === template)
    return match ?? Template.DEFAULT
  }
}
