const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092' /*, 'kafka2:9092' */]
})

async function initTopic(){
	const admin = kafka.admin()
	try{
		await admin.connect()
		await admin.createTopics({
		waitForLeaders: true,
		topics: [
		  { topic: 'test-topic' },
		],
		})
	}catch(ex){
		console.log(ex);
	}
	admin.disconnect()
}

async function testEnvoiMessage(){
	const producer = kafka.producer()
	await producer.connect()
	await producer.send({
	  topic: 'test-topic',
	  messages: [
		{ value: 'Hello KafkaJS user!' },
	  ],
	})
	console.log("message was sent ...");
	await producer.disconnect();
}

async function testReceptionMessage(){
	const consumer = kafka.consumer({ groupId: 'test-group' })

	await consumer.connect()
	await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log({
			value: message.value.toString(),
		})
		},
	})
	console.log("consumer is running ...");
	//no await consumer.disconnect()
}

//initTopic()
testEnvoiMessage();
testReceptionMessage();