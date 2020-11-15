/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URL;
import java.util.Iterator;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 *
 * @author Jeremy
 */
@Stateless
public class DataMappingSessionBean implements DataMappingSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public void createProfileFromFiles(String filePath) throws IOException {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        URL input = classLoader.getResource(filePath);
        File myFile = new File(input.getFile());
        try (FileInputStream fis = new FileInputStream(myFile)) {
            XSSFWorkbook xssfWorkbook = new XSSFWorkbook(fis);
            Sheet ashokaSheet = xssfWorkbook.getSheetAt(0);
            // Get iterator to all the rows in current sheet
            Iterator<Row> rowIterator = ashokaSheet.iterator();
            Row header = rowIterator.next();
            int nameColumn = getColumn(header, "Name");
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                switch (row.getCell(nameColumn).getCellType()) {
                    case STRING:
                        System.out.println(row.getCell(nameColumn).getStringCellValue());
                        break;
                    case NUMERIC:
                        System.out.println(new BigDecimal(String.valueOf(row.getCell(nameColumn).getNumericCellValue())).toBigInteger().toString());
                        break;
                    default:
                }
            }
        }
    }

    private int getColumn(Row row, String header) {
        Iterator<Cell> cellIterator = row.cellIterator();
        while (cellIterator.hasNext()) {
            Cell cell = cellIterator.next();
            switch (cell.getCellType()) {
                case STRING:
                    if (cell.getStringCellValue().trim().equals(header)) {
                        return cell.getColumnIndex();
                    }
                    break;
                case NUMERIC:
                    if (String.valueOf(cell.getNumericCellValue()).trim().equals(header)) {
                        return cell.getColumnIndex();
                    }
                    break;
                case BOOLEAN:
                    if (String.valueOf(cell.getBooleanCellValue()).trim().equals(header)) {
                        return cell.getColumnIndex();
                    }
                    break;
                default:
            }
        }
        return -1;
    }

}
