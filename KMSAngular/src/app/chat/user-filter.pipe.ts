import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {

  transform(list: any[], filterText: string): any {
    return list ? list.filter(item => item.firstName.search(new RegExp(filterText, 'i')) > -1 || item.lastName.search(new RegExp(filterText, 'i')) > -1) : [];
  }

}