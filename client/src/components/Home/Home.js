import React, { useState, useEffect } from 'react'
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core'
import Posts from '../Posts/Posts.js'
import Form from '../Form/Form.js'
import useStyles from './styles'
import { getPosts, getPostsBySearch } from '../../actions/posts.js'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import ChipInput from 'material-ui-chip-input'
import Paginate from '../Pagination.jsx'

function useQuery () {
  return new URLSearchParams(useLocation().search)
}

const Home = () => {
  const [currentId, setCurrentId] = useState(0)
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = useQuery()
  const location = useLocation()
  const page = query.get('page') || 1
  const searchQuery = query.get('searchQuery')

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost()
    }
  }

  const handleAdd = (tag) => {
    setTags([...tags, tag])
  }

  const handleDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete))
  }

  const searchPost = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }))
      navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
    } else {
      navigate('/')
    }
  }

  const classes = useStyles()
  return (
    <Grow in>
      <Container maxWidth='xl'>
        <Grid container justifyContent='space-between' alignItems='stretch' spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <AppBar className={classes.appBarSearch} position='static' color='inherit'>
              <TextField
                name='search'
                variant='outlined'
                label='Search Memories'
                fullWidth
                value={search}
                onKeyPress={handleKeyPress}
                onChange={(e) => {
                  setSearch(e.target.value)
                }}
              />
              <ChipInput
                style={{ margin: '10px 0' }}
                value={tags}
                onAdd={handleAdd}
                onDelete={handleDelete}
                label='Search Tags'
                variant='outlined'
              />
              <Button onClick={searchPost} className={classes.searchButton} color='primary' variant='contained'>Search</Button>
            </AppBar>
            <Form currentId={currentId} setCurrentId={setCurrentId} />
            {(!searchQuery && !tags.length) && (
              <Paper className={classes.pagination} elevation={6}>
                <Paginate page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  )
}

export default Home
