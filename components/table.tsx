import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import MaterialTable from 'material-table'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import tableIcons from '../components/tableIcons'
import awsState from '../store/aws'
import showGraph from '../store/showGraph'
import axios from 'axios'
import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { regionNameMapping, statusMapping } from './const'

dayjs.extend(utc)
dayjs.extend(timezone)

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const Table = (): JSX.Element => {
  // 20200112: dangerouslyAllowMutabilityでできた
  const [aws, setAws] = useRecoilState(awsState)
  const [showG, setShowGraph] = useRecoilState(showGraph)
  const [loading, setLoading] = useState(true)
  const [slackBarOpen, setSlackBarOpen] = React.useState(false)
  const [apiErrorMsg, setApiErrorMsg] = React.useState('')
  useEffect(() => {
    getAwsStatus()
    setLoading(false)
  }, [])
  const getAwsStatus = () => {
    axios
      .get('/api/aws')
      .then((resp) => {
        setAws(resp.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error.response)
        setSlackBarOpen(true)
        setApiErrorMsg(error.response.statusText || 'Error')
        setAws([])
        setLoading(false)
      })
  }
  const handleSnackBarClose = () => {
    setSlackBarOpen(false)
  }
  // @ts-ignore
  return (
    <div className="container">
      <main>
        {/*Actionsに複数Action設定するとTS2769で怒られるのでignore*/}
        {/* @ts-ignore */}
        <MaterialTable
          icons={tableIcons}
          columns={[
            { title: 'Service Name', field: 'service_name' },
            { title: 'Service', field: 'service', width: 10 },
            { title: 'Region', field: 'region', lookup: regionNameMapping },
            { title: 'Summary', field: 'summary' },
            {
              title: 'Date (' + dayjs.tz.guess() + ')',
              field: 'date',
              render: (rowData) => (
                <div>
                  {dayjs
                    .unix(Number(rowData.date))
                    .format('YYYY-MM-DDTHH:mm:ssZ[Z]')}
                </div>
              ),
              defaultSort: 'desc',
              type: 'string',
            },
            {
              title: 'Status',
              field: 'status',
              lookup: statusMapping,
            },
          ]}
          data={aws}
          detailPanel={[
            {
              tooltip: 'Details',
              render: (rowData) => {
                return (
                  <>
                    <div className="title">{rowData.summary}</div>
                    <div className="description">
                      {dayjs
                        .unix(Number(rowData.date))
                        .format('YYYY-MM-DDTHH:mm:ss')}{' '}
                      {rowData.service_name}
                    </div>
                    <div className="code">{rowData.description}</div>
                  </>
                )
              },
            },
          ]}
          options={{
            filtering: true,
            grouping: true,
            exportButton: true,
            exportFileName: 'exported',
            headerStyle: {
              backgroundColor: '#e77f2f',
              color: '#FFF',
            },
          }}
          isLoading={loading}
          actions={[
            {
              // Issue: https://github.com/mbrn/material-table/issues/51
              //@ts-ignore
              icon: tableIcons.BarChartIcon,
              tooltip: 'Show Bar Chart',
              isFreeAction: true,
              disabled: loading,
              onClick: async () => {
                setShowGraph(!showG)
              },
            },
            {
              // Issue: https://github.com/mbrn/material-table/issues/51
              //@ts-ignore
              icon: tableIcons.Refresh,
              tooltip: 'Refresh Data',
              isFreeAction: true,
              disabled: loading,
              onClick: async () => {
                setLoading(true)
                await getAwsStatus()
              },
            },
          ]}
          title={
            <div className="header">
              <img src="/awslogo.png" />
              <a href="https://aws-health-dashboard.vercel.app/">
                AWS Health Dashboard
              </a>
            </div>
          }
        />
        <Snackbar
          open={slackBarOpen}
          autoHideDuration={6000}
          onClose={handleSnackBarClose}
        >
          <Alert onClose={handleSnackBarClose} severity="error">
            AWS Status API Failed: <b>{apiErrorMsg}</b>
          </Alert>
        </Snackbar>
      </main>

      <style jsx>{`
        a {
          color: inherit;
          text-decoration: none;
        }

        .header {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
        }

        .header a {
          color: #e77f2f;
          text-decoration: none;
        }

        .header img {
          height: 0.7em;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 1.5rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 0.9rem;
        }

        .code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default Table
