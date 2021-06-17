/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable security/detect-object-injection */

const axios = require('axios')
const assert = require('assert')

const normalMaze = [
  [2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 3],
]

const simpleMaze = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
]

const smallMaze = [[2, 3]]

const emptyMaze = []

const mazeWithNoStatingPoint = [
  [0, 0, 0],
  [0, 0, 3],
]

const mazeWithNoEndingPoint = [
  [2, 0, 0],
  [0, 0, 1],
]

const hugeMaze = [
  [2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
]

const USER = 'user1'
const PASSWORD = 'password1'

const host = path => `http://localhost:4000${path}`
const token = () => `Basic ${Buffer.from(`${USER}:${PASSWORD}`).toString('base64')}`

const headers = {
  Authorization: token(),
}

const post = (url, body) => {
  return axios(host(url), { method: 'POST', headers, data: body })
}

const put = (url, body) => {
  return axios(host(url), { method: 'PUT', headers, data: body })
}

const get = url => {
  return axios(host(url), { method: 'GET', headers })
}

const run = async maze => {
  console.log('== Running check ==')
  try {
    const newMaze = (await post('/labyrinth')).data
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        const item = maze[i][j]
        switch (item) {
          case 1:
            await put(`/labyrinth/${newMaze.id}/playfield/${j}/${i}/filled`)
            break
          case 2:
            await put(`/labyrinth/${newMaze.id}/start/${j}/${i}`)
            break
          case 3:
            await put(`/labyrinth/${newMaze.id}/end/${j}/${i}`)
            break
          case 0:
            break
          default:
            console.log(`unknown type ${item} at ${j}/${i}, skip`)
        }
      }
    }

    const processedMaze = (await get(`/labyrinth/${newMaze.id}`)).data

    // eslint-disable-next-line no-console
    console.log('Source maze:')
    maze.forEach(m => {
      console.log(m.join(' '))
    })
    console.log('\n')

    console.log('Processed by api maze:')
    processedMaze.matrix.forEach(m => {
      console.log(m.join(' '))
    })
    console.log('\n')

    assert.deepStrictEqual(maze, processedMaze.matrix)

    const solution = (await get(`/labyrinth/${newMaze.id}/solution`)).data
    console.log('Checking solution...')
    if (solution) {
      console.log('Path:')
      console.log(solution.path.join(' '))
      console.log('\n')
      console.log('Maze matrix')
      solution.matrix.forEach(m => {
        console.log(m.join(' '))
      })
    } else {
      console.log('No solution!')
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err?.response?.data)
    } else {
      console.log(err)
    }
  }
  console.log('\n\n')
}

const main = async () => {
  console.log('Checking "normal" maze...')
  await run(normalMaze)

  console.log('Checking small maze...')
  await run(smallMaze)

  console.log('Checking empty maze...')
  await run(emptyMaze)

  console.log('Checking with no start point...')
  await run(mazeWithNoStatingPoint)

  console.log('Checking with no end point...')
  await run(mazeWithNoEndingPoint)

  console.log('Checking huge maze...')
  await run(hugeMaze)

  console.log('Checking simple maze...')
  await run(simpleMaze)
}

main()
