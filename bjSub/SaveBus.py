import pandas as pd


def SaveBus(received_data):
    names = received_data['name']
    results = received_data['result']
    data = []
    via_stops = []
    data.append(results['name'])
    for row in results['via_stops']:
        via_stops.append([row['name'], row['location']['lng'], row['location']['lat'], row['sequence']])
    data.append(via_stops)
    output = open('BeiJingBus.csv', 'a', encoding='gbk')
    for i in range(len(data)):
        output.write(str(data[i]))  # write函数不能写int类型的参数，所以使用str()转化
        output.write('\t')  # 相当于Tab一下，换一个单元格
    output.write('\n')  # 写完一行立马换行
    output.close()
    print("{}存储成功".format(results['name']))
