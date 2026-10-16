import './css/loading.css'

const LoadingScreen = ({
  title,
  description,
  progress,
  transitionDuration,
  progressLabel
}) => (
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
      <h1>{title}</h1>
      <p className="learn_loading_description">{description}</p>
      <div className="learn_loading_progress">
        <div
          className="learn_loading_progress_track"
          role="progressbar"
          aria-label={progressLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="learn_loading_progress_bar"
            style={{
              width: `${progress}%`,
              transitionDuration: `${transitionDuration}ms`
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
)

export default LoadingScreen
