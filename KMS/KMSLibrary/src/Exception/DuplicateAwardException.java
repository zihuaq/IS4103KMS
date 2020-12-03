/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Exception;

/**
 *
 * @author zeplh
 */
public class DuplicateAwardException extends Exception {

    /**
     * Creates a new instance of <code>DuplicateAwardException</code> without
     * detail message.
     */
    public DuplicateAwardException() {
    }

    /**
     * Constructs an instance of <code>DuplicateAwardException</code> with the
     * specified detail message.
     *
     * @param msg the detail message.
     */
    public DuplicateAwardException(String msg) {
        super(msg);
    }
}
