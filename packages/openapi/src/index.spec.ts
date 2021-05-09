import * as s from '@tsio/schema'
import * as util from 'util'

import { defaultConverters } from './converters'
import { SchemaConverterContext } from './registry'

enum Status {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PENDING = 'pending'
}

describe('test', () => {
  it('is a test', () => {
    function pageResource<A, O>(schema: s.Schema<A, O>) {
      return s.type({
        data: s.array(schema),
        has_more: s.boolean
      })
    }

    const PatientResource = s
      .type({
        object: s.literal('patient').document({
          description: 'Always `patient`'
        }),
        id: s.string.document({
          description: 'The unique identifier for the patient'
        }),
        first_name: s.string.document({
          description: 'The first name for the patient'
        }),
        last_name: s.string.document({
          description: 'The last name for the patient'
        })
      })
      .named('patient')

    const PatientPage = pageResource(PatientResource)

    const ExpandablePatient = s.union([s.string, PatientResource]).document({
      description: 'Patient that this resource points to'
    })

    const device = s
      .type({
        patient: ExpandablePatient,
        status: s.enum(Status)
      })
      .named('device')

    const schema = PatientPage

    const context = new SchemaConverterContext([...defaultConverters])

    console.log(util.inspect(context.resolve(schema), false, 100, true))
    console.log(util.inspect(context.knownSchemas(), false, 100, true))
  })
})
