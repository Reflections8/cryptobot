const { Telegraf } = 
require('telegraf')
require('dotenv').config();

const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN, {polling: true});
const cryptoApi = 'e004c903335523b9f63d4f54228c50a0d2854758b27e1d43e5a9ac4538182438';

bot.start(async (ctx, next) => {await bot.telegram.sendPhoto(
	ctx.chat.id, 'https://img.kapital.kz/EBvFrDTlg1o/czM6Ly9rYXBpdGFsLXN0YXRpYy9pbWcvOC82LzgvYi9jL2FmOGU3Mzk3NmQ5NDIzZjFiNDRmNTk1YzA3Zi5qcGc', 
	{caption: `Приветствую, ${ctx.from.first_name}. Добро пожаловать в бот "Курсы криптовалют". Бот предоставляет актуальный курс всех популярных криптовалют, а также всю основную информацию по криптовалютам.`}, {parse_mode: "HTML"}
	);
	next();
});

function startCommand(ctx) {
	bot.telegram.sendMessage(ctx.chat.id, 'Выберите нужный пункт меню. Чтобы перезапустить бота Вы можете воспользоваться командой /start',
	{
		reply_markup: {
			inline_keyboard: [
				[
					{text: 'Курсы криптовалют', callback_data: 'price'}
				],
				[
					{text: 'Перейти на Coin Market Cup', url: 'https://coinmarketcap.com/'}
				],
				[
					{text: 'Что такое криптовалюта?', callback_data: 'what-is'},
					{text: 'Как создать Bitcoin-кошелек?', callback_data: 'bitcoin-wallet'}
				],
				[
					{text: 'Подробно про Etherium', callback_data: 'what-is-eth'},
					{text: 'Особенность работы с криптовалютой (РК)', callback_data: 'crypto-taxes'}
				]
			]
		}
	});
}

bot.command('start', ctx => {
	startCommand(ctx);
});

bot.action('start', ctx => {
	ctx.deleteMessage();
	startCommand(ctx);
})

bot.action('what-is', ctx=> {
	ctx.deleteMessage();
	bot.telegram.sendMessage(ctx.chat.id, `${ctx.from.first_name}, рады что Вы интересуетесь этой темой.
Криптовалюта - это разновидность цифровой валюты с децентрализованной платежной системой. Изначально, криптовалюта никем и ничем не регулировалась. 
	
Развернутый ответ на вопрос "Что такое криптовалюта" Вы узнаете, посмотрев видео по ссылке:
https://www.youtube.com/watch?v=IZcqKuhWhH8`, 
{ 
	reply_markup: {
	inline_keyboard: [
				[
					{text: 'Назад в главное меню', callback_data: 'start'}
				]
			]
		}
	});
});

bot.action('bitcoin-wallet', ctx => {
	ctx.deleteMessage();
	bot.telegram.sendMessage(ctx.chat.id, 'Как правильно и безопасно создать свой первый Bitcoin-кошелек? Вот отличное видео от канала MyGap, https://www.youtube.com/watch?v=OaipdG6UzKM',
	{ 
		reply_markup: {
		inline_keyboard: [
					[
						{text: 'Назад в главное меню', callback_data: 'start'}
					]
				]
			}
		})
});

bot.action('what-is-eth', ctx => {
	ctx.deleteMessage();
	bot.telegram.sendMessage(ctx.chat.id, 'Что такое "Эфириум" (Etherium) и как работает эта блокчейн-платформа?, https://www.youtube.com/watch?v=Tdf4UTLu7H4',
	{ 
		reply_markup: {
		inline_keyboard: [
					[
						{text: 'Назад в главное меню', callback_data: 'start'}
					]
				]
			}
		})
});

bot.action('crypto-taxes', ctx => {
	ctx.deleteMessage();
	bot.telegram.sendMessage(ctx.chat.id, 'В чём особенность работы с криптовалютой в Казахстане (ориг. статьи - Forbes Kazakhstan), https://forbes.kz//process/expertise/ob_osobennostyah_rabotyi_kriptovalyutnyih_birj_na_territorii_kazahstana/?',
	{ 
		reply_markup: {
		inline_keyboard: [
					[
						{text: 'Назад в главное меню', callback_data: 'start'}
					]
				]
			}
		})
});

bot.action('price', ctx => {
	ctx.deleteMessage();
	bot.telegram.sendMessage(ctx.chat.id, 'Выберите интересующую Вас криптовалюту. Вы получите всю основную актуальную информацию по выбранной криптовалюте. Информация обновляется в режиме реального времени.',
	{
		reply_markup: {
			inline_keyboard: [
				[
					{text: '₿ (Bitcoin)', callback_data: 'price-BTC'},
					{text: 'Ξ (Etherium)', callback_data: 'price-ETH'}
				],
				[
					{text: 'Ƀ (Bitcoin Cash)', callback_data: 'price-BCH'},
					{text: 'Ł (Litecoin)', callback_data: 'price-LTC'}
				],
				[
					{text: 'Назад в главное меню', callback_data: 'start'}
				],
			]
		}
	});
});

let priceActionList = ['price-BTC', 'price-ETH', 'price-BCH', 'price-LTC'];

bot.action(priceActionList, async ctx => {
	let symbol = ctx.match[0].split('-')[1];
	console.log(symbol);

	try {
		let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=KZT&api_key=${cryptoApi}`);
		let data = res.data.DISPLAY[symbol].KZT;

		console.log(data);

		let message = 
		`
${ctx.from.first_name}, вот какая информация на данный момент.

Криптовалюта: ${symbol}
Текущая цена: ${data.PRICE}
Цена открытия: ${data.OPENDAY}
Максимальная цена: ${data.HIGHDAY}
Минимальная цена: ${data.LOWDAY}

Динамика курса за последние сутки: ${data.CHANGE24HOUR}

Информация обновлена: ${data.LASTUPDATE}

`;

		ctx.deleteMessage();
		bot.telegram.sendMessage(ctx.chat.id, message, {reply_markup: {
			inline_keyboard: [
				[
					{text: 'Назад к списку валют', callback_data: 'price'}
				]
			]
		}
		});
	} catch(err) {
		console.log(err);
		ctx.reply('Произошла ошибка. Пожалуйста, повторите еще раз/перезапустите бота');
	}

	//https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD,EUR
});



bot.launch();