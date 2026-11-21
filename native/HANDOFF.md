# Native Swift ImageMorpher — Agent Handoff

Last updated: 2026-11-20
Status: native client migrated; cloud/local engine work not started yet.

## TL;DR

- The native Swift app and `MorpherCore` live in `osamja/imagemorpher-mobile` under `native/`.
- Work branch: `native-swift-app` (commit `2eb3e34`, pushed).
- PR was not created because `gh` credentials are invalid. Compare page:
  https://github.com/osamja/imagemorpher-mobile/pull/new/native-swift-app
- Core tests: 58/58 passing. App tests pass locally; the Vision-dependent
  test skips in the simulator because this Xcode 14.2 environment cannot
  create a Vision inference context.
- Next feature: a **Cloud / Local** morph engine toggle. Cloud is the
  default; local is the automatic fallback if the cloud call fails.

## Repos and worktrees

### Client/mobile repo

`git@github.com:osamja/imagemorpher-mobile.git`

- Canonical worktree for this task:
  `/Users/sammyjaved/Documents/programming/imagemorpher-mobile-native`
- Branch: `native-swift-app` (based on `origin/master` at `97c5471`)
- Main checkout:
  `/Users/sammyjaved/Documents/programming/imagemorpher-mobile`
- IMPORTANT: the main checkout has uncommitted React Native work on
  `master` (`src/screens/Morph.jsx`,
  `src/components/buttons/MorphButton.jsx`, untracked `dist/`).
  Do not checkout/switch branches there or discard those changes.
  Work in the worktree above.

### Server repo

`git@github.com:osamja/ImageMorpher.git`

- `master` is `a603041`.
- Relevant recent commits:
  - `a603041` / `4621406`: legacy `complete` status shim for iOS clients.
  - `82c08c8`: server perf work (cached detection, vectorized warp).
  - `#23`–`#25`: deploy/CI fixes.
- README now lists `osamja/imagemorpher-mobile` as the iOS app repo.
- An older native branch, `ios/swift-rewrite-complete`, was pushed here as a
  backup. Do not open a PR there. Delete it after the mobile PR merges.
- `docs/swift-rewrite.md` still describes the old same-repo layout; it is
  stale and should be updated or moved.

## Product decisions

- Two engines:
  - **Cloud** (default): uploads the two photos to `https://pyaar.ai`,
    polls the existing server pipeline, downloads the resulting GIF.
  - **Local**: runs entirely on-device via `MorpherCore`, exports video.
- If cloud fails for any reason other than user cancellation, automatically
  run the local pipeline and show a dismissible notice. Keep the user's
  engine selection as Cloud; do not silently persist a switch.
- Preserve each backend's native format:
  - Cloud result: GIF (preview by decoding frames; share/save the GIF).
  - Local result: H.264/HEVC video.
- Cloud presets, matching the shipped MyMorph app:
  - Quality: `Fast` = stepSize 20, `Standard` = 10, `Smooth` = 5.
  - Speed: `Slow` = duration 400 ms, `Normal` = 250 ms, `Fast` = 125 ms.
  - Defaults: Standard / Normal.
- Cloud default; local fallback. Show a clear privacy note:
  "Cloud uploads your photos to pyaar.ai." / "On-device stays on this device."
- No Apple auth is required today: the server endpoints are anonymous.
  Leave an optional bearer-token hook for when auth is enabled.
- App identity is aligned with the shipped app:
  - Bundle ID: `com.sammyjaved.imagemorpher`
  - Display name: `MyMorph`
  - Deployment target: iOS 16
- History is JSON-backed for now (`HistoryStore.swift`). SwiftData requires
  Xcode 15+/iOS 17, so do not switch until the toolchain is upgraded.

## Current native layout

```
native/
├── ImageMorpher.xcodeproj
├── ImageMorpher/
│   ├── ImageMorpherApp.swift
│   ├── ContentView.swift
│   ├── MorphViewModel.swift
│   └── HistoryStore.swift
├── ImageMorpherTests/
│   ├── HistoryStoreTests.swift
│   ├── MorphViewModelTests.swift
│   └── Fixtures/face-1.jpeg, face-2.jpeg
├── MorpherCore/
│   ├── Package.swift
│   ├── Sources/MorpherCore/
│   │   ├── Image/ (loader, buffer, CGImage conversion)
│   │   ├── Face/ (Vision detector, cropper, landmarks)
│   │   ├── Geometry/ (Delaunay, barycentric, triangle)
│   │   ├── Warp/ (affine warp, dissolve)
│   │   ├── Morph/ (Morpher, SequenceGenerator)
│   │   └── Output/ (VideoEncoder, StillExporter)
│   └── Tests/MorpherCoreTests/
└── tools/ (scipy/Python fixture generators)
```

Core test images are bundled as SwiftPM resources in
`native/MorpherCore/Tests/MorpherCoreTests/Fixtures/Images/`.
The app test images are in `native/ImageMorpherTests/Fixtures/`.

## Baseline builds/tests

Run from the worktree:

```bash
cd native/MorpherCore
swift test
```

```bash
cd native
xcodebuild test \
  -project ImageMorpher.xcodeproj \
  -scheme ImageMorpher \
  -destination 'platform=iOS Simulator,name=iPhone 14' \
  CODE_SIGNING_ALLOWED=NO
```

Debug and Release simulator builds pass. Local app test result:
- `HistoryStoreTests`: pass
- `MorphViewModelTests.testMorphPipelineProducesFramesVideoAndHistory`: pass
- `MorphViewModelTests.testVisionFacePipelineWhenAvailable`: skipped

Vision caveat: on this machine (Xcode 14.2 on a newer macOS), Vision in the
simulator can throw `"Could not create inference context"`. The app test
skips only on `FaceCropperError.visionFailure`. Core Vision tests pass on
macOS via `swift test`. Prefer Xcode 15.4 + iPhone 15 simulator or a real
device for full Vision verification.

## Server API contract

Base URL: `https://pyaar.ai` (configurable for tests).

1. Upload one image:

```
POST /morph/upload
Content-Type: multipart/form-data

firstImageRef = <file; image/jpeg; filename="image.jpg">
```

Response: a JSON string containing the server-cropped filename, e.g.
`"2024-...-hash.jpg"`. The client may need to handle a raw string or a
quoted JSON string.

2. Start the morph:

```
POST /morph
Content-Type: multipart/form-data

firstImageRef  = <filename from upload 1>
secondImageRef = <filename from upload 2>
isAsync        = True
clientId       = ios-MyMorph
isSequence     = True
stepSize       = 20 | 10 | 5
duration       = 400 | 250 | 125
```

Response JSON:

```json
{ "morphId": "<uuid>", "morphUri": "https://pyaar.ai/facemorphs/<file>.gif" }
```

3. Poll:

```
GET /morph/status/<uuid>/
```

Response JSON:

```json
{
  "status": "pending | processing | completed | complete | failed | cancelled | deleted",
  "morphUri": "https://pyaar.ai/facemorphs/<file>.gif",
  "progress": 0,
  "intermediateImages": ["https://pyaar.ai/facemorphs/<frame>.jpg"]
}
```

Notes:
- Accept both `complete` and `completed` as success. The server currently
  maps `completed` to `complete` for CFNetwork/MyMorph user agents only.
- Set `User-Agent: MyMorph-native/0.1` (contains "MyMorph"). Still accept
  both statuses.
- Upload the **original loaded image** (max 600 px), not the locally
  cropped one, so the server's own autocrop/dlib pipeline runs.
- The server endpoints are currently anonymous. Add an optional
  `bearerToken` field to options for future auth, but do not require it.
- Do not hit production from automated tests. Use a URLProtocol mock.

## Immediate implementation plan

### A. MorpherCore

Add these without touching the Xcode project (SwiftPM auto-includes files):

1. `Output/StillExporter.swift`
   - Add `jpegData(from:quality:)`.
   - Add `gifData(from:frameDuration:)` for tests/optional use.

2. `Output/GIFDecoder.swift`
   - Decode GIF data into frames + frame durations using ImageIO.
   - Types: `GIFAnimation { frames: [ImageBuffer], frameDurations: [Double] }`.
   - Error: invalid data / no frames.

3. `Server/ServerMorpher.swift`
   - `ServerMorphOptions`:
     - `baseURL` default `https://pyaar.ai`
     - `stepSize` default 10 (clamp 1...101)
     - `duration` default 250 (clamp 1...10000)
     - `clientID` default `ios-MyMorph`
     - `userAgent` default `MyMorph-native/0.1`
     - optional `bearerToken`
     - `pollInterval` default 1 s
     - `timeout` default 120 s
   - `ServerMorphStatus`: pending, processing, completed, complete, failed,
     cancelled, deleted. Helpers: `isSuccess`, `isFailure`.
   - `ServerMorphProgress { status, percent, intermediateImageURLs }`
   - `ServerMorphResult { gifURL, gifData, intermediateImageURLs }`
   - `ServerMorpherError`: invalid URL, image encoding failed, invalid
     response, HTTP status, decoding failed, job failed, timed out.
   - `CloudMorphing` protocol:
     ```swift
     func morph(
       image1: ImageBuffer,
       image2: ImageBuffer,
       options: ServerMorphOptions,
       onProgress: @escaping (ServerMorphProgress) -> Void
     ) async throws -> ServerMorphResult
     ```
   - `ServerMorpher(session: URLSession = .shared)` for test injection.
   - Flow: upload both images sequentially (or parallel), start morph, poll,
     report progress, download GIF on success, throw on failure/timeout.
   - Multipart writer with CRLF correctness.
   - `URLRequest.timeoutInterval`; `Task.checkCancellation` in the poll loop.
   - Handle relative/absolute `morphUri` and intermediate URLs.
   - Optional `Authorization: Bearer ...`.
   - Important: `baseURL` may have a path prefix; build endpoints with
     `URLComponents` rather than naive string concatenation.

4. Tests
   - `StillExporterTests`: JPEG round-trip, GIF round-trip.
   - `GIFDecoderTests`: 2-frame GIF, frame count/durations/dimensions.
   - `ServerMorpherTests` with `URLProtocol` mock:
     - Full flow: upload → start → processing 50 → completed 100 → GIF.
     - Both `complete` and `completed`.
     - Multipart fields/header assertions.
     - HTTP 500 → `.httpStatus`.
     - Job status `failed` → `.jobFailed`.
     - Poll timeout → `.timedOut` (short timeout/poll interval).
     - Optional bearer token appears in headers.

### B. App

Only existing app files need edits unless a new file is unavoidable. If you
add a new app file, update `native/ImageMorpher.xcodeproj/project.pbxproj`.

1. `HistoryStore.swift`
   - Add `MorphMediaKind: String, Codable { case video, gif }`.
   - `MorphRecord`:
     - new fields `mediaFilename`, `mediaKind`
     - custom `Codable` migration: old records have `videoFilename`, no
       `mediaKind`; default to `.video`.
   - `HistoryStore.save(mediaURL:kind:thumbnail:)`.
   - `mediaURL(for:)` replaces `videoURL(for:)`.
   - Copy `.mp4` or `.gif` accordingly.
   - Update `HistoryStoreTests`; add a legacy-record decode test.

2. `MorphViewModel.swift`
   - Add `MorphEngine { cloud, local }`, persisted in UserDefaults,
     default `.cloud`.
   - Add `CloudQuality` / `CloudSpeed` enums, persisted, default
     Standard/Normal, mapped to stepSize/duration.
   - Add `@Published var fallbackNotice: String?`.
   - Rename `videoURL` → `mediaURL`; add `mediaKind`.
   - Store the original loaded image per slot for cloud upload
     (`firstCloudImage`, `secondCloudImage`) plus the cropped image and
     landmarks for local.
   - `Stage.processing` should carry a label, e.g.
     `.processing(label: "Morphing in cloud", completed:, total:)` so the
     UI can say "frame X of Y" locally and "50%" in cloud.
   - `morph()` branches:
     - local: existing sequence/video path.
     - cloud: call `ServerMorpher` with cloud options, update progress,
       decode GIF frames, write a temp GIF, save history as `.gif`.
   - Automatic fallback:
     - On any cloud error except cancellation, set a notice and run the
       local path with the already-cropped images/landmarks.
     - Do not change the persisted engine.
   - `playbackFrameDuration` for GIF frame timing; local stays ~0.07 s.
   - `saveToPhotos` branches: video via
     `creationRequestForAssetFromVideo(atFileURL:)`; GIF via
     `creationRequestForAssetFromImage(atFileURL:)`.
   - `mediaURL(for record:)` and thumbnail helpers.
   - Inject `cloudMorpher: CloudMorphing = ServerMorpher()` in init for tests.

3. `ContentView.swift`
   - Engine segmented picker above the photo slots; default Cloud.
   - Cloud-only quality/speed segmented pickers.
   - Privacy note based on engine.
   - Dismissible fallback banner.
   - Processing label and percentage vs frame count.
   - Morph button label: "Morph in cloud" / "Morph on-device".
   - ShareLink and Save use `mediaURL`.
   - History sheet: `VideoPlayer` for `.video`; an `AnimatedImageView`
     (`UIViewRepresentable` around `UIImageView` loading
     `UIImage(contentsOfFile:)`) for `.gif`.
   - Disable engine/options while processing.

4. App tests
   - Existing local pipeline test: set `viewModel.engine = .local`.
   - New cloud success test with a fake `CloudMorphing` returning a
     `StillExporter.gifData` payload; assert frames, `.gif` media/history.
   - New fallback test with a fake cloud that throws; assert the local
     video result, `.video` history, and non-nil fallback notice.
   - Keep the Vision test skip behavior.

### C. Build, test, push

```bash
cd native/MorpherCore && swift test
cd native && xcodebuild test -project ImageMorpher.xcodeproj \
  -scheme ImageMorpher \
  -destination 'platform=iOS Simulator,name=iPhone 14' \
  CODE_SIGNING_ALLOWED=NO
```

Then commit on `native-swift-app` and push. The migration PR and this feature
can share the branch unless the user asks for separate PRs.

## Risks and guardrails

- Never disturb the React Native WIP in
  `/Users/sammyjaved/Documents/programming/imagemorpher-mobile`.
- Do not run live production morphs in the automated test suite. Use
  `URLProtocol` mocks. A manual production check is acceptable only if the
  user asks.
- The test images include a personal selfie and celebrity photos that are
  already in the public server repo. The user said their work is open source;
  still, flag this before duplicating them into new public history.
- The server may change status strings. Accept both `complete` and
  `completed`.
- Cloud fallback should be automatic, but cancellation must disable it.
- The server pipeline and on-device pipeline will not look pixel-identical
  (dlib/scipy vs Vision/Swift). That is expected; the engine choice is
  explicit.
- `gh auth status` is invalid in this environment (`HTTP 401`). The user must
  run `gh auth login` or create the PR from the browser before an agent can
  use `gh pr create`.
- The old `ImageMorpher` native branch is only a backup. Do not merge it into
  the server repo.

## Suggested first actions for the next agent

1. `git -C /Users/sammyjaved/Documents/programming/imagemorpher-mobile worktree list`
   and confirm the branch/worktree above.
2. Run the baseline core + app tests.
3. Implement `StillExporter` JPEG/GIF, `GIFDecoder`, and `ServerMorpher` with
   mocked tests.
4. Wire `MorphViewModel` cloud/local + automatic fallback and update the
   history model.
5. Add the engine UI and cloud presets to `ContentView`.
6. Run the full suites, commit, push, and create/update the PR once `gh` is
   authenticated.
