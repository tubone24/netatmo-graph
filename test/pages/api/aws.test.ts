jest.mock('axios')
import axios, { AxiosInstance } from 'axios'
import httpMocks from 'node-mocks-http'
import handler, { AwsStatusResp } from '../../../pages/api/aws'
import { NextApiRequest, NextApiResponse } from 'next'
// tslint:disable-next-line:no-any
const myAxios: jest.Mocked<AxiosInstance> = axios as any

const mockData: AwsStatusResp = {
  archive: [
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      service_name: 'test',
      date: '12345678',
      description: 'test',
      details: '',
      service: 'autoscaring',
      status: '0',
      summary: 'test',
    },
  ],
}
myAxios.get.mockResolvedValue(mockData)

describe('aws', () => {
  it('200ok', () => {
    const mockReq = httpMocks.createRequest<NextApiRequest>({
      query: {
        timezone: 'Asia/Tokyo',
      },
    })
    const mockRes = httpMocks.createResponse<NextApiResponse>()
    handler(mockReq, mockRes)
    expect(mockRes.statusCode).toEqual(200)
  })
})
