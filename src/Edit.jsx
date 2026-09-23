import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './css/edit.css'
import { TiArrowBack } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL, getImageUrl } from './api'

const Edit = () => {
  const [data, setData] = useState([])
  const [selectedCata, setSelectedCata] = useState('fruit')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [originalName, setOriginalName] = useState('')
  const [originalCategory, setOriginalCategory] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [displayData, setDisplayData] = useState({
    i_name: '',
    i_color: '',
    i_place: '',
    i_no_t: '',
    i_gt_food: '',
    i_nut_sc: '',
    i_img: ''
  })
  const imagePreviewUrl = useRef(null)
  const listRef = useRef(null)


  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/data`)
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err)
        setError('Failed to load data')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])


  // Filter data according to selected category
  const filteredData = data.filter(
    item => item.category === selectedCata
  )

  // Currently selected item
  const selectedItem = filteredData[selectedIndex]

  useEffect(() => {
    const selectedButton = listRef.current?.querySelector('.selected')
    selectedButton?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex, selectedCata, filteredData.length])

  // Update display data whenever selected item changes
  useEffect(() => {
    if (!selectedItem) return

    setDisplayData({
      i_name: selectedItem.name || '',
      i_color: selectedItem.color || '',
      i_place: selectedItem.place || '',
      i_no_t: selectedItem.no_t || '',
      i_gt_food: selectedItem.gt || '',
      i_nut_sc: selectedItem.nut_sc || '',
      i_img: getImageUrl(selectedItem.img)
    })

    setOriginalName(selectedItem.name || '')
    setOriginalCategory(selectedItem.category || '')
    setSelectedFile(null)
  }, [selectedItem])

  useEffect(() => {
    setImageLoading(Boolean(displayData.i_img))
  }, [displayData.i_img])

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.current) {
        URL.revokeObjectURL(imagePreviewUrl.current)
      }
    }
  }, [])



  // Change category
  const handleCategoryChange = e => {
    setSelectedCata(e.target.value)
    setSelectedIndex(0)
  }

  // Select item from list
  const handleSelect = index => {
    setSelectedIndex(index)
  }


  const logout = () => {
    sessionStorage.removeItem('isLoggedIn')
    navigate('/Login')
  }

  //add-new button
  const handleAdd = () => {
    setDisplayData({
      i_name: '',
      i_color: '',
      i_place: '',
      i_no_t: '',
      i_gt_food: '',
      i_nut_sc: '',
      i_img: ''
    })

    setSelectedFile(null)
    setOriginalName('')
    setOriginalCategory('')
    setSelectedIndex(-1)
  }


  //insert button
  const handleInsert = async () => {
    if (!displayData.i_name.trim()) {
      alert('Please enter a name')
      return
    }

    try {
      const formData = new FormData()

      formData.append('name', displayData.i_name)
      formData.append('no_t', displayData.i_no_t)
      formData.append('color', displayData.i_color)
      formData.append('place', displayData.i_place)
      formData.append('nut_sc', displayData.i_nut_sc)
      formData.append('gt', displayData.i_gt_food)
      formData.append('category', selectedCata)

      if (selectedFile) {
        formData.append('img', selectedFile)
      }

      await axios.post(
        `${API_BASE_URL}/data`,
        formData
      )

      const response = await axios.get(
        `${API_BASE_URL}/data`
      )

      setData(response.data)
      setSelectedFile(null)
      setSelectedIndex(0)

      alert('Item inserted successfully')
    } catch (err) {
      console.error('Insert failed:', err)

      alert(
        err.response?.data?.message ||
        'Insert failed. Please try again.'
      )
    }
  }


  //Update button
  const handleUpdate = async () => {
    if (!originalName) {
      alert('Please select an item first')
      return
    }

    try {
      const formData = new FormData()

      formData.append('name', displayData.i_name)
      formData.append('no_t', displayData.i_no_t)
      formData.append('color', displayData.i_color)
      formData.append('place', displayData.i_place)
      formData.append('nut_sc', displayData.i_nut_sc)
      formData.append('gt', displayData.i_gt_food)

      // New category
      formData.append('category', selectedCata)

      if (selectedFile) {
        formData.append('img', selectedFile)
      }

      // Original category is used to find the existing record
      await axios.put(
        `${API_BASE_URL}/data/${encodeURIComponent(originalName)}/${originalCategory}`,
        formData
      )

      const response = await axios.get(
        `${API_BASE_URL}/data`
      )

      setData(response.data)
      setSelectedFile(null)

      alert('Item updated successfully')
    } catch (err) {
      console.error('Update failed:', err)

      alert(
        err.response?.data?.message ||
        'Update failed. Please try again.'
      )
    }
  }



  //Delete button
  const handleDelete = async () => {
    if (!originalName) {
      alert('Please select an item first')
      return
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${originalName}?`
    )

    if (!confirmDelete) {
      return
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/data/${encodeURIComponent(originalName)}/${originalCategory}`
      )

      const response = await axios.get(
        `${API_BASE_URL}/data`
      )

      setData(response.data)
      setSelectedIndex(0)
      setSelectedFile(null)
      setOriginalName('')
      setOriginalCategory('')

      alert('Item deleted successfully')

    } catch (err) {
      console.log(err)
      alert('Delete failed')
    }
  }

  //handle browse button
  const handleBrowse = e => {
    const file = e.target.files[0]

    if (!file) return

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a JPG, JPEG or PNG image')
      e.target.value = ''
      return
    }

    // Revoke previous preview URL
    if (imagePreviewUrl.current) {
      URL.revokeObjectURL(imagePreviewUrl.current)
    }

    // Create new preview URL
    const imageUrl = URL.createObjectURL(file)

    imagePreviewUrl.current = imageUrl

    setSelectedFile(file)

    setDisplayData(prev => ({
      ...prev,
      i_img: imageUrl
    }))
  }


  /**************/

  return (
    <div className="edit_outer">

      <nav>
        <button
          type="button"
          id="back_btn"
          onClick={() => navigate('/')}
        >
          <TiArrowBack size={20} color="white" />
        </button>


        <button onClick={logout} id="logout_btn">
          Log out
        </button>
      </nav>

      <div
        className="e_form"
        action={`${API_BASE_URL}/toddler/Crud`}
      >
        <main>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}

          <section id="left">
            <h1>Master Page</h1>

            <label htmlFor="cat">
              Select Category:
            </label>

            <select
              name="cat"
              id="cat"
              value={selectedCata}
              onChange={handleCategoryChange}
            >
              <option value="fruit">Fruits</option>
              <option value="veg">Vegetables</option>
              <option value="animal">Animals</option>
              <option value="bird">Birds</option>
            </select>

            <br />

            <label htmlFor="lb_list" id="label_lb">
              Select {
                {
                  fruit: 'Fruit',
                  veg: 'Vegetable',
                  animal: 'Animal',
                  bird: 'Bird'
                }[selectedCata]
              }:
            </label>

            <div
              id="lb_list"
              className="object_list"
              role="listbox"
              aria-label="Select item"
              ref={listRef}
            >
              {filteredData.map((opt, index) => (
                <button
                  type="button"
                  key={opt.name}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={selectedIndex === index ? 'selected' : ''}
                  onClick={() => handleSelect(index)}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </section>

          <section id="right">

            <div className="top">

              <div id="box1">

                <label htmlFor="i_name">
                  Name
                </label>

                <input
                  type="text"
                  id="i_name"
                  name="i_name"
                  value={displayData.i_name}
                  onChange={e =>
                    setDisplayData({
                      ...displayData,
                      i_name: e.target.value
                    })
                  }
                />

                <label htmlFor="no_t">
                  Number Of Types
                </label>

                <input
                  type="text"
                  id="no_t"
                  name="no_t"
                  value={displayData.i_no_t}
                  onChange={e =>
                    setDisplayData({
                      ...displayData,
                      i_no_t: e.target.value
                    })
                  }
                />

                <label htmlFor="color">
                  Color
                </label>

                <textarea
                  id="color"
                  name="color"
                  value={displayData.i_color}
                  onChange={e =>
                    setDisplayData({
                      ...displayData,
                      i_color: e.target.value
                    })
                  }
                />

                <label htmlFor="place">
                  Place
                </label>

                <input
                  type="text"
                  id="place"
                  name="place"
                  value={displayData.i_place}
                  onChange={e =>
                    setDisplayData({
                      ...displayData,
                      i_place: e.target.value
                    })
                  }
                />

                <label htmlFor="g_type" id="label_gt">
                  g/f
                </label>

                <textarea
                  name="g_type"
                  id="g_type"
                  value={displayData.i_gt_food}
                  onChange={e =>
                    setDisplayData({
                      ...displayData,
                      i_gt_food: e.target.value
                    })
                  }
                />

                <label htmlFor="nut" id="label_nut">
                  n/sc
                </label>

                <textarea
                  name="nut"
                  id="nut"
                  value={displayData.i_nut_sc}
                  onChange={e =>
                    setDisplayData({
                      ...displayData,
                      i_nut_sc: e.target.value
                    })
                  }
                />

              </div>

              <div id="img_box">

                <div className={imageLoading ? 'image_frame image_loading' : 'image_frame'}>
                  <img
                    key={displayData.i_img || 'empty-image'}
                    alt="img"
                    id="img_p"
                    src={displayData.i_img}
                    onLoad={() => setImageLoading(false)}
                  />
                </div>

                <input
                  type="file"
                  id="image_input"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleBrowse}
                  style={{ display: 'none' }}
                />

                <label
                  htmlFor="image_input"
                  id="btn_browse"
                >
                  Browse
                </label>


              </div>

            </div>


            <div className="bottom">

              <div id="btns">

                <button
                  id="btn_add"
                  type="button"
                  onClick={handleAdd}
                >
                  Add New
                </button>

                <button
                  id="btn_ins"
                  type="button"
                  onClick={handleInsert}
                >
                  Insert
                </button>

                <button
                  id="btn_up"
                  type="button"
                  onClick={handleUpdate}
                  disabled={!originalName}
                >
                  Update
                </button>

                <button
                  id="btn_del"
                  type="button"
                  onClick={handleDelete}
                  disabled={!originalName}
                >
                  Delete
                </button>

              </div>

            </div>

          </section>

        </main>
      </div>

    </div>
  )
}

export default Edit
