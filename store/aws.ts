import { atom } from 'recoil'

const awsState = atom({
  key: 'aws',
  default: [
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      service_name: 'Auto Scaling (N. Virginia)',
      summary: '[RESOLVED] Example Error',
      date: '1542849575',
      status: '1',
      details: '',
      description:
        'The issue has been resolved and the service is operating normally.',
      service: 'autoscaling',
      region: 'us-east-1',
    },
  ],
  dangerouslyAllowMutability: true,
})

export default awsState
