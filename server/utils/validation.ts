const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/

interface ValidationRule {
  field: string
  value: unknown
  required?: boolean
  type?: 'string' | 'number'
  maxLength?: number
  pattern?: RegExp
  patternMessage?: string
}

function validateFields(rules: ValidationRule[]): void {
  for (const rule of rules) {
    if (rule.required && (rule.value === undefined || rule.value === null || rule.value === '')) {
      throw createError({
        statusCode: 400,
        message: `${rule.field} is required`,
      })
    }

    if (rule.value === undefined || rule.value === null) continue

    if (rule.type === 'string' && typeof rule.value !== 'string') {
      throw createError({
        statusCode: 400,
        message: `${rule.field} must be a string`,
      })
    }

    if (rule.type === 'number' && (typeof rule.value !== 'number' || Number.isNaN(rule.value))) {
      throw createError({
        statusCode: 400,
        message: `${rule.field} must be a number`,
      })
    }

    if (rule.maxLength && typeof rule.value === 'string' && rule.value.length > rule.maxLength) {
      throw createError({
        statusCode: 400,
        message: `${rule.field} must be at most ${rule.maxLength} characters`,
      })
    }

    if (rule.pattern && typeof rule.value === 'string' && !rule.pattern.test(rule.value)) {
      throw createError({
        statusCode: 400,
        message: rule.patternMessage || `${rule.field} has invalid format`,
      })
    }
  }
}

export function validateCategoryInput(body: Record<string, unknown>, isCreate: boolean): void {
  validateFields([
    {
      field: 'name',
      value: body.name,
      required: isCreate,
      type: 'string',
      maxLength: 100,
    },
    {
      field: 'color',
      value: body.color,
      required: isCreate,
      type: 'string',
      pattern: HEX_COLOR_REGEX,
      patternMessage: 'color must be a valid hex color (e.g., #FF0000)',
    },
    {
      field: 'description',
      value: body.description,
      type: 'string',
      maxLength: 500,
    },
  ])
}

export function validateTermInput(body: Record<string, unknown>, isCreate: boolean): void {
  validateFields([
    {
      field: 'root',
      value: body.root,
      required: isCreate,
      type: 'string',
      maxLength: 200,
    },
    {
      field: 'meaning',
      value: body.meaning,
      required: isCreate,
      type: 'string',
      maxLength: 500,
    },
    {
      field: 'category_id',
      value: body.category_id,
      required: isCreate,
      type: 'number',
    },
  ])
}

export function validateLoginInput(body: Record<string, unknown>): void {
  validateFields([
    { field: 'username', value: body.username, required: true, type: 'string', maxLength: 100 },
    { field: 'password', value: body.password, required: true, type: 'string', maxLength: 200 },
  ])
}
