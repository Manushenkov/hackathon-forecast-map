/* eslint-disable no-undef */
import { useEffect, useState } from 'react'
import './App.css'

const mapStyle = {
	width:
		window.innerWidth ||
		document.documentElement.clientWidth ||
		document.body.clientWidth,
	height:
		window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight,
}

const rawData = [
	[53.4264481, -6.2499098],
	[53.99794, -6.405957],
	[54.607868, -5.926437],
	[55.006763, -7.318268],
	[53.270962, -9.062691],
	[54.15, -4.4833],
	[53.85, -9.3],
	[52.3745, -7.9252],
	[51.9, -8.4731],
	[52.8051, -4.71262],
	[53.400002, -2.983333],
	[53.817505, -3.035675],
	[54.2667, -8.4833],
	[53.727, -7.7998],
	[52.6653, -8.6238],
	[52.2583, -7.119],
	[52.2675, -9.6962],
]

const mockData = {
	fog: [
		[53.4264481, -6.2499098],
		[53.99794, -6.405957],
		[54.607868, -5.926437],
		[55.006763, -7.318268],
	],
	storm: [
		[53.270962, -9.062691],
		[54.15, -4.4833],
		[53.85, -9.3],
		[52.3745, -7.9252],
		[51.9, -8.4731],
		[52.8051, -4.71262],
	],
	hail: [
		[53.400002, -2.983333],
		[53.817505, -3.035675],
		[54.2667, -8.4833],
		[53.727, -7.7998],
		[52.6653, -8.6238],
	],
	none: [
		[52.2583, -7.119],
		[52.2675, -9.6962],
	],
}

const realData = {
	fog: [
		[53.270962, -9.062691],
		[53.4264481, -6.2499098],
	],
	storm: [
		[53.727, -7.7998],
		[51.9, -8.4731],
	],
	hail: [[52.2675, -9.6962]],
	none: [
		[54.15, -4.4833],
		[53.85, -9.3],
		[53.817505, -3.035675],
		[54.2667, -8.4833],
		[52.8051, -4.71262],
		[52.6653, -8.6238],
		[52.2583, -7.119],
		[53.400002, -2.983333],
		[52.3745, -7.9252],
	],
}

const getColorFromType = (type) => {
	const typeToColor = {
		fog: {
			fillColor: '#41414196',
			strokeColor: '#414141e3',
		},
		storm: {
			fillColor: '#ff000099',
			strokeColor: 'ff0000f2',
		},
		hail: {
			fillColor: '#5aa1ff77',
			strokeColor: '#597eff77',
		},
		none: {
			fillColor: '#b1b1b154',
			strokeColor: '#b1b1b18a',
		},
	}
	return typeToColor[type]
}

const circlesSet = new Set()

const createWeatherCircle = (type, coordinates) => {
	const circle = new ymaps.Circle(
		[coordinates, 8000],
		{
			balloonContent: 'В городе X возможен ' + type,
			hintContent: type,
		},
		{
			...getColorFromType(type),
			strokeOpacity: 0.7,
			strokeWidth: 2,
		}
	)

	circlesSet.add(circle)
	return circle
}

const renderCircles = (map, data) => {
	data.fog.forEach((coordinates) => {
		map.geoObjects.add(createWeatherCircle('fog', coordinates))
	})
	data.hail.forEach((coordinates) => {
		map.geoObjects.add(createWeatherCircle('hail', coordinates))
	})
	data.storm.forEach((coordinates) => {
		map.geoObjects.add(createWeatherCircle('storm', coordinates))
	})
	data.none.forEach((coordinates) => {
		map.geoObjects.add(createWeatherCircle('none', coordinates))
	})
}

function App() {
	const [isShowLegend, setIsShowLegend] = useState(false)
	const [isShowMockData, setIsShowMockData] = useState(undefined)

	useEffect(() => {
		ymaps.ready(init)
		function init() {
			window.myMap = new ymaps.Map('map', {
				center: [53.5, -8],
				controls: ['zoomControl'],
				zoom: 7.4,
			})

			renderCircles(window.myMap, realData)
		}
	}, [])

	useEffect(() => {
		if (isShowMockData === undefined) return

		for (const circle of circlesSet) window.myMap.geoObjects.remove(circle)
		circlesSet.clear()

		renderCircles(window.myMap, isShowMockData ? mockData : realData)
	}, [isShowMockData])

	return (
		<div className='App'>
			<div
				onClick={() => setIsShowMockData((prev) => !prev)}
				className='switch'
			>
				{isShowMockData
					? 'Переключиться на realtime данные'
					: 'Переключиться на данные-загушку'}
			</div>
			<div className='title'>
				{isShowMockData
					? 'Пример, использующий данные-заглушку'
					: 'Мониторинг потенциальных опасных погодных условий в реальном времени'}
			</div>
			<div className='hint'>
				<div
					className='hint-title'
					onClick={() => setIsShowLegend((prev) => !prev)}
				>
					Легенда
				</div>
				{isShowLegend && (
					<>
						<div className='legend-item-container'>
							<div className='circle circle-storm' />
							<div>Шторм</div>
						</div>
						<div className='legend-item-container'>
							<div className='circle circle-fog' />
							<div>Туман</div>
						</div>
						<div className='legend-item-container'>
							<div className='circle circle-hail' />
							<div>Град</div>
						</div>
						<div className='legend-item-container'>
							<div className='circle circle-none' />
							<div>Ничего</div>
						</div>
					</>
				)}
			</div>

			<div id='map' style={mapStyle}></div>
		</div>
	)
}

export default App
