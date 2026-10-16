import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './css/learn.css';
import { TiArrowBack } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import { API_BASE_URL, getImageUrl } from './api';
import toast from 'react-hot-toast';
import './css/image-loading.css';

const MIN_LOADING_DURATION = 3000;

const Learn = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [progressTransitionDuration, setProgressTransitionDuration] = useState(100);
  const [activeItem, setActiveItem] = useState('Fruits');
  const [selectedCata, setSelectedCata] = useState('fruit');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedImage, setLoadedImage] = useState(null);
  const listRef = useRef(null);

  const menuItems = [
    { name: 'Fruits', value: 'fruit' },
    { name: 'Vegetables', value: 'veg' },
    { name: 'Animals', value: 'animal' },
    { name: 'Birds', value: 'bird' },
    { name: 'Eng-Letters', value: 'e_letter' },
    { name: 'Tam-Letters', value: 't_letter' },
    { name: 'Body Parts', value: 'B_P' },
    { name: 'Shapes', value: 'shape' }
  ];

  // Get data from backend
  useEffect(() => {
    toast.success('Learn Page Opened');

    const controller = new AbortController();
    const loadingStartedAt = Date.now();
    let isActive = true;
    let loadingTimeout;
    const progressInterval = window.setInterval(() => {
      const elapsed = Date.now() - loadingStartedAt;
      setLoadingProgress(
        Math.min(90, (elapsed / MIN_LOADING_DURATION) * 90)
      );
    }, 50);

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/data`, {
          signal: controller.signal
        });
        if (isActive) {
          setData(res.data);
        }
      } catch (err) {
        if (isActive && !axios.isCancel(err)) {
          console.error('Error fetching data:', err);
        }
      } finally {
        if (isActive) {
          window.clearInterval(progressInterval);
          const remainingLoadingTime = Math.max(
            0,
            MIN_LOADING_DURATION - (Date.now() - loadingStartedAt)
          );
          setProgressTransitionDuration(remainingLoadingTime);
          setLoadingProgress(100);
          loadingTimeout = window.setTimeout(
            () => setIsLoading(false),
            remainingLoadingTime
          );
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
      controller.abort();
      window.clearTimeout(loadingTimeout);
      window.clearInterval(progressInterval);
    };
  }, []);

  // Filter data according to selected category
  const filteredData = data.filter(
    (item) => item.category === selectedCata
  );

  // Currently selected item
  const selectedItem = filteredData[selectedIndex] || filteredData[0];
  const selectedImage = selectedItem?.img || '';
  const imageLoading = Boolean(selectedItem) && loadedImage !== selectedImage;

  useEffect(() => {
    const selectedButton = listRef.current?.querySelector('.selected');
    selectedButton?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, selectedCata, filteredData.length]);


  // Change category
  const handleCategoryChange = (item) => {
    setActiveItem(item.name);
    setSelectedCata(item.value);
    setSelectedIndex(0);
  };

  // Select item from list
  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  // Next item
  const handleNext = () => {
    if (selectedIndex < filteredData.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    }
  };

  // Previous item
  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <main className="learn_loading_screen" role="status" aria-live="polite">
        <div className="learn_loading_content">
          <div className="learn_loading_icon" aria-hidden="true">
            <svg viewBox="0 0 96 96">
              <path
                className="learn_loading_cloud"
                d="M25 63a15 15 0 0 1 2-30 22 22 0 0 1 42 4 14 14 0 0 1 3 27H25Z"
              />
              <path
                className="learn_loading_download"
                d="M48 43v28m-11-11 11 11 11-11"
              />
            </svg>
          </div>
          <h1>Loading Your Learning Content...</h1>
          <p className="learn_loading_description">
            We’re fetching the latest learning content from the server.
          </p>
          <div className="learn_loading_progress">
            <div
              className="learn_loading_progress_track"
              role="progressbar"
              aria-label="Loading learning content"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(loadingProgress)}
            >
              <div
                className="learn_loading_progress_bar"
                style={{
                  width: `${loadingProgress}%`,
                  transitionDuration: `${progressTransitionDuration}ms`
                }}
              />
            </div>
          </div>
          <p className="learn_loading_note">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v11m-4-4 4 4 4-4M5 16v4h14v-4" />
            </svg>
            This may take a few seconds on the first load.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="learn_outer">

      <nav>
        <Link to="/" className='back_button'>
          <TiArrowBack size={30} />
        </Link>

        <ul>
          {menuItems.map((item) => (
            <li
              key={item.value}
              className={activeItem === item.name ? 'active' : ''}
              onClick={() => handleCategoryChange(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </nav>

      <div className="learn_form">
        <div className="inner">

          <div className="left">

            <div className="top">
              <label htmlFor="lb_list">
                Select Object
              </label>

              <div
                id="lb_list"
                className="object_list"
                role="listbox"
                aria-label="Select object"
                ref={listRef}
              >
                {filteredData.map((item, index) => (
                  <button
                    type="button"
                    key={item.name}
                    role="option"
                    aria-selected={selectedIndex === index}
                    className={selectedIndex === index ? 'selected' : ''}
                    onClick={() => handleSelect(index)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bottom">

              <button
                type="button"
                onClick={handlePrevious}
                disabled={selectedIndex === 0}
              >
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={
                  selectedIndex >= filteredData.length - 1
                }
              >
                Next
              </button>

            </div>
          </div>

          <section className="learn_content">
            {
              selectedCata === 'fruit' || selectedCata === 'veg' || selectedCata === 'animal' || selectedCata === 'bird' ?
                (<section id="m1">

                  {selectedItem ? (
                    <>
                      <div>
                        <h1 id="p_name">
                          {selectedItem.name}
                        </h1>

                        <label htmlFor="no_t">
                          Number Of Types
                        </label>

                        <input
                          type="text"
                          id="no_t"
                          name="no_t"
                          value={selectedItem.no_t || ''}
                          readOnly
                        />

                        <br />

                        <label htmlFor="color">
                          Color
                        </label>

                        <textarea
                          name="color"
                          id="color"
                          rows="2"
                          value={selectedItem.color || ''}
                          readOnly
                        />
                      </div>

                      <div id="p_img" className={imageLoading ? 'image_loading' : ''}>
                        {imageLoading && (
                          <span className="image_loading_ring" role="status" aria-label="Loading image" />
                        )}
                        <img
                          key={selectedItem.img}
                          src={getImageUrl(selectedItem.img)}
                          alt={selectedItem.name}
                          id="img_p"
                          onLoad={() => setLoadedImage(selectedImage)}
                          onError={(e) => {
                            e.currentTarget.src = './photos/no_img.jpg';
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="place">
                          Place
                        </label>

                        <input
                          type="text"
                          id="place"
                          name="place"
                          value={selectedItem.place || ''}
                          readOnly
                        />
                      </div>

                      <div id="gt_box">
                        <label htmlFor="g_type">
                          {selectedCata === 'fruit' ||
                            selectedCata === 'veg'
                            ? 'Growtype'
                            : 'Food'}
                        </label>

                        <textarea
                          name="g_type"
                          id="g_type"
                          rows="2"
                          value={selectedItem.gt || ''}
                          readOnly
                        />
                      </div>

                      <div id="nut_box">
                        <label htmlFor="nut">
                          {selectedCata === 'fruit' ||
                            selectedCata === 'veg'
                            ? 'Nutrients'
                            : 'Special characteristics'}
                        </label>

                        <textarea
                          name="nut"
                          id="nut"
                          rows="2"
                          value={selectedItem.nut_sc || ''}
                          readOnly
                        />
                      </div>
                    </>
                  ) : (
                    <p>No data available.</p>
                  )}

                </section>) :
                (<section id="m2" className={imageLoading ? 'image_loading' : ''}>
                  {selectedItem ? (
                    <>
                      {imageLoading && (
                        <span className="image_loading_ring" role="status" aria-label="Loading image" />
                      )}
                      <img
                        key={selectedItem.img}
                        src={getImageUrl(selectedItem.img)}
                        alt={selectedItem.name}
                        onLoad={() => setLoadedImage(selectedImage)}
                        onError={(e) => {
                          e.currentTarget.src = './photos/no_img.jpg';
                        }}
                      />
                    </>
                  ) : (
                    <p>No data available.</p>
                  )}
                </section>)}
          </section >

        </div>
      </div>
    </main >
  );
};

export default Learn;
