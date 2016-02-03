#!/usr/bin/env node
// Ment to be run as cron and sent to the appropriate elasticsearch cluster/index to enable
// Monitoring-Analytics of the systems in your network
//
// Notes on elasticsearch node SDK:  https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-create 
// Plan (be like Marvel)
// Create index, setup aliases - 1 per day to load performance data to
// 

// Script Configuration Variables
var es_host       = 'localhost:9200';
var index_name    = 'servers';
var index_type    = 'performance';

// Script
var elasticsearch = require('elasticsearch');
var client        = elasticsearch.Client({host: es_host,log:'trace'});
var disk          = require('diskusage');
var os            = require('os');

function get_data(options,callback) {
	
	var hostname     = os.hostname();
	var num_cpus     = os.cpus().length;
	var loadavg      = os.loadavg();
	var uptime       = os.uptime();
	var freemem      = os.freemem();
	var totalmem     = os.totalmem();
	var platform     = os.platform();
	var release      = os.release();
	var arch         = os.arch();
	var cpu          = os.cpus()[0]["model"];
	var ip           = os.networkInterfaces()["en0"][1]["address"];
	var mac          = os.networkInterfaces()["en0"][1]["mac"];
	var storage_path = '/';
	disk.check('/',function(err,info) {
	  var disk_info = info;
	  var data      = { hostname, num_cpus, loadavg, uptime, freemem, totalmem, platform, 
		                release, arch, cpu, ip, mac, disk_info };
	  callback(data);
	});
}

function push_data(payload,callback) {
	var payload = { index: index_name, type: index_type, body: payload };
	
	// Push payload to elastic search
	client.create(payload,callback(error,result));
}

function create_index(schema,callback) {
	var client = elasticsearch;
	
	callback()
}

// Main script 
var options = {};
get_data(options,function(options) {
	console.log(options);
	console.log("\n");
});
