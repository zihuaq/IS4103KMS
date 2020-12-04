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
public class QuestionnaireAlreadyCompletedException extends Exception {

    /**
     * Creates a new instance of
     * <code>QuestionnaireAlreadyCompletedException</code> without detail
     * message.
     */
    public QuestionnaireAlreadyCompletedException() {
    }

    /**
     * Constructs an instance of
     * <code>QuestionnaireAlreadyCompletedException</code> with the specified
     * detail message.
     *
     * @param msg the detail message.
     */
    public QuestionnaireAlreadyCompletedException(String msg) {
        super(msg);
    }
}
