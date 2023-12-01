const { ALL_QUESTIONS } = require('../../../../app/config/question-bank')
let varList

const referenceCostObject = {
  data: {
    grantScheme: {
      key: 'SLURRY01',
      name: 'Slurry Infrastructure Grant'
    },
    desirability: {
      catagories: [{
        key: 'cat-storage',
        title: 'Storage',
        items: [
          {
            item: 'Above-ground steel slurry store',
            amount: 22,
            unit: 'per cubic metre'
          },
          {
            item: 'Precast circular concrete slurry store',
            amount: 17,
            unit: 'per cubic metre'
          },
          {
            item: 'In-situ cast-reinforced concrete slurry store',
            amount: 15,
            unit: 'per cubic metre'
          },
          {
            item: 'Earth-bank lagoon with consolidated clay lining',
            amount: 8,
            unit: 'per cubic metre'
          },
          {
            item: 'Earth-bank lagoon with internal liner',
            amount: 12,
            unit: 'per cubic metre'
          },
          {
            item: 'Stores using pre-cast rectangular concrete panels',
            amount: 14,
            unit: 'per cubic metre'
          },
          {
            item: 'Large-volume supported slurry bag (over 2,500 cubic metres)',
            amount: 20,
            unit: 'per cubic metre'
          }
        ]
      },
      {
        key: 'cat-cover-type',
        title: 'Cover type',
        items: [
          {
            item: 'Rigid cover for steel or concrete slurry stores',
            amount: 8,
            unit: 'per square metre'
          },
          {
            item: 'Fixed flexible cover',
            amount: 4,
            unit: 'per square metre'
          },
          {
            item: 'Floating flexible cover',
            amount: 3,
            unit: 'per square metre'
          }
        ]
      },
      {
        key: 'cat-separator',
        title: 'Slurry separator equipment',
        items: [
          {
            item: 'Roller screen press',
            amount: 21234,
            unit: 'per unit'
          },
          {
            item: 'Screw press',
            amount: 22350,
            unit: 'per unit'
          },
          {
            item: 'Gantry',
            amount: 5154,
            unit: 'per unit'
          },
          {
            item: 'Concrete pad',
            amount: 6414,
            unit: 'per unit'
          },
          {
            item: 'Concrete bunker',
            amount: 168.18,
            unit: 'per square metre'
          }
        ]
      },
      {
        key: 'cat-reception-pit-type',
        title: 'Reception pit type',
        items: [
          {
            item: 'Reception pit',
            amount: 30,
            unit: 'per cubic metre'
          }
        ]
      },
      {
        key: 'cat-pump-type',
        title: 'Pump type',
        items: [
          {
            item: 'Electric-powered slurry transfer pump',
            amount: 1050,
            unit: 'per pump'
          },
          {
            item: 'Powered take off (PTO) or hydraulically powered slurry transfer pump',
            amount: 2090,
            unit: 'per pump'
          },
          {
            item: 'Centrifugal chopper pump',
            amount: 950,
            unit: 'per pump'
          },
          {
            item: 'Powered take off (PTO) or hydraulically driven chopper pump',
            amount: 1700,
            unit: 'per pump'
          }
        ]
      },
      {
        key: 'cat-pipework',
        title: 'Pipework',
        items: [
          {
            item: 'Galvanised steel pipework 100mm diameter',
            amount: 14,
            unit: 'per metre'
          },
          {
            item: 'Galvanised steel pipework 150mm diameter diameter',
            amount: 24,
            unit: 'per metre'
          },
          {
            item: 'Polyethylene (PE) or equivalent pipework 100mm diameter',
            amount: 8,
            unit: 'per metre'
          },
          {
            item: 'Polyethylene (PE) or equivalent pipework 150mm diameter',
            amount: 9,
            unit: 'per metre'
          }
        ]
      },
      {
        key: 'cat-transfer-channels',
        title: 'Transfer channels',
        items: [
          {
            item: 'Under-floor transfer channels',
            amount: 25,
            unit: 'per metre'
          }
        ]
      },
      {
        key: 'cat-agitator',
        title: 'Agitator',
        items: [
          {
            item: 'Slurry store wall mixers with store capacity up to 1,200 cubic metre',
            amount: 350,
            unit: 'per tank'
          },
          {
            item: 'Slurry store wall mixers with store capacity up to 8,000 cubic metre ',
            amount: 1000,
            unit: 'per tank'
          }
        ]
      },
      {
        key: 'cat-safety-equipment',
        title: 'Safety equipment',
        items: [
          {
            item: 'Inspection platform with ladder for above-ground concrete and steel slurry store',
            amount: 800,
            unit: 'per item'
          },
          {
            item: 'Safety fencing for stores constructed below gorund leve, earth-bank lagoons and slurry bags',
            amount: 55,
            unit: 'per metre'
          }
        ]
      }],
      overallRating: {
        score: null,
        band: null
      }
    }
  }

}

ALL_QUESTIONS.forEach(question => {
  if (question.preValidationKeys) {
    varList = question.preValidationKeys.map(m => {
      return { m: 'someValue' }
    })
  }
})
jest.doMock('../../../../app/helpers/session', () => ({
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (varList[key]) return varList[key]
    else return 'Error'
  }
}))

describe('All default GET routes', () => {
  varList.planningPermission = 'Not yet applied'
  varList.PlanningPermissionEvidence = {
    planningAuthority: 'some planning',
    planningReferenceNumber: '123456-ref'
  }
  varList.referenceCostObject = referenceCostObject

  ALL_QUESTIONS.forEach(question => {
    it(`should load ${question.key} page successfully`, async () => {
      const options = {
        method: 'GET',
        url: `${global.__URLPREFIX__}/${question.url}`
      }
      const response = await global.__SERVER__.inject(options)
      expect(response.statusCode).toBe(200)
    })
  })
})
